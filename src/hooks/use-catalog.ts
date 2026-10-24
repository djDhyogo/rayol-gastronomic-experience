import { queryOptions, useQuery } from "@tanstack/react-query";
import { fetchCatalog, fetchMenus } from "@/services/catalog.service";
import { queryKeys } from "@/lib/query-keys";
import { ApiError } from "@/services/api-client";
import type { Catalog, Product } from "@/types/catalog";

const STALE_TIME = 5 * 60 * 1000;
const GC_TIME = 30 * 60 * 1000;

function retryCatalog(failureCount: number, error: unknown) {
  if (error instanceof ApiError && error.status === 404) return false;
  return failureCount < 2;
}

export function menusQueryOptions() {
  return queryOptions({
    queryKey: queryKeys.menus,
    queryFn: ({ signal }) => fetchMenus(signal),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    retry: (failureCount, error) => {
      if (error instanceof ApiError && error.status === 404) return false;
      return failureCount < 1;
    },
  });
}

export function catalogQueryOptions(menu: string | null) {
  return queryOptions({
    queryKey: queryKeys.catalog(menu),
    queryFn: ({ signal }) => fetchCatalog(menu, signal),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    retry: retryCatalog,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),
  });
}

export function useMenus() {
  return useQuery(menusQueryOptions());
}

/** `catalogSlug` vem de `/menu/:slug`. Ausente, a API devolve a listagem geral. */
export function useCatalog(catalogSlug?: string | null) {
  const slug = catalogSlug?.trim() || null;
  return useQuery(catalogQueryOptions(slug));
}

export function findProductBySlug(catalog: Catalog | undefined, slug: string): Product | undefined {
  return catalog?.products.find((product) => product.slug === slug);
}
