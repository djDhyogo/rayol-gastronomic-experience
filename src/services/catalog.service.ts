import { z } from "zod";
import { apiGet } from "@/services/api-client";
import { categorySchema, menuSchema, paginatedSchema, productSchema } from "@/schemas/catalog";
import type {
  ApiCategory,
  ApiProduct,
  Catalog,
  Category,
  Product,
  ProductBadge,
  PublicMenu,
} from "@/types/catalog";
import { cleanCategoryName, formatPrice, normalize, toNumber, truncate } from "@/utils/format";
import { HAPPY_HOUR_SLUG, HIDDEN_CATEGORY_SLUGS, PROMO_SLUG } from "@/constants/restaurant";
import { productImageUrl } from "@/lib/product-images";

const PAGE_SIZE = 200;
const MAX_PAGES = 20;
const FALLBACK_POSITION = Number.MAX_SAFE_INTEGER;

const productsPage = paginatedSchema(productSchema);
const categoriesPage = paginatedSchema(categorySchema);
const menuList = z.array(menuSchema);

async function fetchAllPages<T>(
  resource: string,
  parse: (raw: unknown) => { results: T[]; next: string | null },
  menu: string | null,
  signal?: AbortSignal,
): Promise<T[]> {
  const items: T[] = [];

  for (let page = 1; page <= MAX_PAGES; page += 1) {
    const raw = await apiGet<unknown>(
      withMenu(`/catalog/${resource}/?page=${page}&page_size=${PAGE_SIZE}`, menu),
      signal,
    );
    const parsed = parse(raw);
    items.push(...parsed.results);
    if (!parsed.next) break;
  }

  return items;
}

function compareByPosition(
  a: { position: number; name: string },
  b: { position: number; name: string },
): number {
  return a.position - b.position || a.name.localeCompare(b.name, "pt-BR");
}

function buildBadges(product: ApiProduct, newestCodes: Set<string>): ProductBadge[] {
  const badges: ProductBadge[] = [];
  const description = product.description ?? "";

  if (product.category_slug === PROMO_SLUG) badges.push("Promoção");
  if (product.category_slug === HAPPY_HOUR_SLUG) badges.push("Happy Hour");
  if (description.trim().length >= 90) badges.push("Chef recomenda");
  if (product.code && newestCodes.has(product.code)) badges.push("Novidade");

  return badges;
}

function toProduct(raw: ApiProduct, newestCodes: Set<string>): Product {
  const description = (raw.description ?? "").trim();
  const categoryName = cleanCategoryName(raw.category_name || "Outros");

  return {
    id: raw.id,
    code: raw.code,
    name: raw.name.trim(),
    slug: raw.slug,
    description,
    shortDescription: truncate(description, 110),
    price: toNumber(raw.price),
    priceLabel: formatPrice(raw.price),
    sellType: raw.sell_type,
    categoryId: raw.category,
    categoryName,
    categorySlug: raw.category_slug,
    position: raw.position,
    badges: buildBadges(raw, newestCodes),
    imageUrl: productImageUrl(raw.slug),
    searchIndex: normalize(
      [raw.name, description, categoryName, raw.category_slug, raw.slug, raw.code].join(" "),
    ),
  };
}

function withMenu(path: string, menu: string | null): string {
  if (!menu) return path;
  const joiner = path.includes("?") ? "&" : "?";
  return `${path}${joiner}menu=${encodeURIComponent(menu)}`;
}

export async function fetchMenus(signal?: AbortSignal): Promise<PublicMenu[]> {
  const raw = await apiGet<unknown>("/catalog/menus/", signal);
  return menuList
    .parse(raw)
    .slice()
    .sort((a, b) => a.position - b.position || a.name.localeCompare(b.name, "pt-BR"));
}

function toCategories(raw: ApiCategory[], products: Product[]): Category[] {
  return raw
    .map((category) => ({
      id: category.id,
      name: cleanCategoryName(category.name),
      slug: category.slug,
      position: category.position,
      count: products.filter((product) => product.categoryId === category.id).length,
    }))
    .filter((category) => category.count > 0 && !HIDDEN_CATEGORY_SLUGS.includes(category.slug))
    .sort(compareByPosition);
}

export async function fetchCatalog(menu: string | null, signal?: AbortSignal): Promise<Catalog> {
  const [rawProducts, rawCategories] = await Promise.all([
    fetchAllPages<ApiProduct>("products", (raw) => productsPage.parse(raw), menu, signal),
    fetchAllPages<ApiCategory>("categories", (raw) => categoriesPage.parse(raw), menu, signal),
  ]);

  const newestCodes = new Set(
    [...rawProducts]
      .filter((product) => product.code && /^\d+$/.test(product.code))
      .sort((a, b) => Number(b.code) - Number(a.code))
      .slice(0, 6)
      .map((product) => product.code as string),
  );

  const positionById = new Map(rawCategories.map((category) => [category.id, category.position]));

  const categoryIds = new Set(
    rawCategories
      .filter((category) => !HIDDEN_CATEGORY_SLUGS.includes(category.slug))
      .map((category) => category.id),
  );

  const products = rawProducts
    .filter((product) => product.category !== null && categoryIds.has(product.category))
    .map((product) => toProduct(product, newestCodes))
    .sort((a, b) => {
      const categoryPositionA = positionById.get(a.categoryId ?? "") ?? FALLBACK_POSITION;
      const categoryPositionB = positionById.get(b.categoryId ?? "") ?? FALLBACK_POSITION;
      return (
        categoryPositionA - categoryPositionB ||
        a.position - b.position ||
        a.name.localeCompare(b.name, "pt-BR")
      );
    });

  return { products, categories: toCategories(rawCategories, products) };
}
