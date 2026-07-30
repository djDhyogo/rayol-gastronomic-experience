import { apiGet } from "@/services/api-client";
import { categorySchema, paginatedSchema, productSchema } from "@/schemas/catalog";
import type { ApiCategory, ApiProduct, Catalog, Category, Product, ProductBadge } from "@/types/catalog";
import { cleanCategoryName, formatPrice, normalize, toNumber, truncate } from "@/utils/format";
import {
  CATEGORY_ORDER,
  HAPPY_HOUR_SLUG,
  HIDDEN_CATEGORY_SLUGS,
  PROMO_SLUG,
} from "@/constants/restaurant";

const PAGE_SIZE = 200;
const MAX_PAGES = 20;

const productsPage = paginatedSchema(productSchema);
const categoriesPage = paginatedSchema(categorySchema);

async function fetchAllPages<T>(
  resource: string,
  parse: (raw: unknown) => { results: T[]; next: string | null },
  signal?: AbortSignal,
): Promise<T[]> {
  const items: T[] = [];

  for (let page = 1; page <= MAX_PAGES; page += 1) {
    const raw = await apiGet<unknown>(
      `/catalog/${resource}/?page=${page}&page_size=${PAGE_SIZE}`,
      signal,
    );
    const parsed = parse(raw);
    items.push(...parsed.results);
    if (!parsed.next) break;
  }

  return items;
}

function orderIndex(slug: string): number {
  const index = CATEGORY_ORDER.indexOf(slug as (typeof CATEGORY_ORDER)[number]);
  return index === -1 ? CATEGORY_ORDER.length : index;
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
    badges: buildBadges(raw, newestCodes),
    searchIndex: normalize(
      [raw.name, description, categoryName, raw.category_slug, raw.slug, raw.code].join(" "),
    ),
  };
}

function toCategories(raw: ApiCategory[], products: Product[]): Category[] {
  return raw
    .map((category) => ({
      id: category.id,
      name: cleanCategoryName(category.name),
      slug: category.slug,
      position: category.position,
      count: products.filter((product) => product.categorySlug === category.slug).length,
    }))
    .filter(
      (category) =>
        category.count > 0 && !HIDDEN_CATEGORY_SLUGS.includes(category.slug),
    )
    .sort(
      (a, b) =>
        orderIndex(a.slug) - orderIndex(b.slug) || a.name.localeCompare(b.name, "pt-BR"),
    );
}

export async function fetchCatalog(signal?: AbortSignal): Promise<Catalog> {
  const [rawProducts, rawCategories] = await Promise.all([
    fetchAllPages<ApiProduct>("products", (raw) => productsPage.parse(raw), signal),
    fetchAllPages<ApiCategory>("categories", (raw) => categoriesPage.parse(raw), signal),
  ]);

  const newestCodes = new Set(
    [...rawProducts]
      .filter((product) => product.code && /^\d+$/.test(product.code))
      .sort((a, b) => Number(b.code) - Number(a.code))
      .slice(0, 6)
      .map((product) => product.code as string),
  );

  const products = rawProducts
    .map((product) => toProduct(product, newestCodes))
    .sort(
      (a, b) =>
        orderIndex(a.categorySlug) - orderIndex(b.categorySlug) ||
        a.name.localeCompare(b.name, "pt-BR"),
    );

  return { products, categories: toCategories(rawCategories, products) };
}
