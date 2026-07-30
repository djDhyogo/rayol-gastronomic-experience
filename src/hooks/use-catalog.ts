import { queryOptions, useQuery } from "@tanstack/react-query";
import { fetchCatalog } from "@/services/catalog.service";
import { queryKeys } from "@/lib/query-keys";
import type { Catalog, Product } from "@/types/catalog";

export const catalogQueryOptions = queryOptions({
  queryKey: queryKeys.catalog,
  queryFn: ({ signal }) => fetchCatalog(signal),
  staleTime: 5 * 60 * 1000,
  gcTime: 30 * 60 * 1000,
  retry: 2,
  retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),
});

export function useCatalog() {
  return useQuery(catalogQueryOptions);
}

export function findProductBySlug(catalog: Catalog | undefined, slug: string): Product | undefined {
  return catalog?.products.find((product) => product.slug === slug);
}
