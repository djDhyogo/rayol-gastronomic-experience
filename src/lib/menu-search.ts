export type MenuSearch = {
  catalog_slug?: string;
};

function firstString(value: unknown): string | undefined {
  const raw = Array.isArray(value) ? value[0] : value;
  return typeof raw === "string" ? raw : undefined;
}

function trimmed(value: unknown): string {
  return firstString(value)?.trim() ?? "";
}

/**
 * Lê um slug antigo na query (`catalog_slug` ou `menu`) só para redirecionar
 * ao caminho `/menu/:slug`. A página em si usa o parâmetro da rota.
 */
export function validateMenuSearch(search: Record<string, unknown>): MenuSearch {
  const catalog_slug = trimmed(search.catalog_slug) || trimmed(search.menu);
  return catalog_slug ? { catalog_slug } : {};
}

/** `/menu/cafe-da-manha` ou `/menu/cafe-da-manha/bebidas`. */
export function menuHref(catalogSlug?: string, category?: string): string {
  if (!catalogSlug) return "/menu";
  const catalog = encodeURIComponent(catalogSlug);
  if (!category) return `/menu/${catalog}`;
  return `/menu/${catalog}/${encodeURIComponent(category)}`;
}
