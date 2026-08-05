import { useMemo } from "react";
import type { Product } from "@/types/catalog";
import { normalize } from "@/utils/format";
import { HAPPY_HOUR_SLUG, PROMO_SLUG } from "@/constants/restaurant";

export interface MenuFilters {
  search: string;
  categorySlug: string | null;
  maxPrice: number | null;
  onlyPromo: boolean;
  onlyHappyHour: boolean;
}

export const defaultFilters: MenuFilters = {
  search: "",
  categorySlug: null,
  maxPrice: null,
  onlyPromo: false,
  onlyHappyHour: false,
};

export function useFilteredProducts(products: Product[] | undefined, filters: MenuFilters) {
  return useMemo(() => {
    if (!products) return [];
    const term = normalize(filters.search);

    return products.filter((product) => {
      if (filters.categorySlug && product.categorySlug !== filters.categorySlug) return false;
      if (filters.onlyPromo && product.categorySlug !== PROMO_SLUG) return false;
      if (filters.onlyHappyHour && product.categorySlug !== HAPPY_HOUR_SLUG) return false;
      if (filters.maxPrice !== null && product.price > filters.maxPrice) return false;
      if (term && !product.searchIndex.includes(term)) return false;
      return true;
    });
  }, [products, filters]);
}

export interface ProductGroup {
  slug: string;
  name: string;
  products: Product[];
}

export function useGroupedProducts(products: Product[]): ProductGroup[] {
  return useMemo(() => {
    const groups = new Map<string, ProductGroup>();

    for (const product of products) {
      const existing = groups.get(product.categorySlug);
      if (existing) {
        existing.products.push(product);
      } else {
        groups.set(product.categorySlug, {
          slug: product.categorySlug,
          name: product.categoryName,
          products: [product],
        });
      }
    }

    return [...groups.values()];
  }, [products]);
}

export function priceBounds(products: Product[] | undefined): [number, number] {
  if (!products?.length) return [0, 100];

  const prices = products
    .map((product) => product.price)
    .filter((price) => Number.isFinite(price) && price > 0);

  if (!prices.length) return [0, 100];

  return [0, Math.ceil(Math.max(...prices))];
}
