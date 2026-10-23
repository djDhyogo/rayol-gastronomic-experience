import type { PublicMenu } from "@/types/catalog";

export type MenuSearch = {
  menu?: string;
};

/** Lê `?menu=` da URL. Vazio ou ausente usa o cardápio padrão da API. */
export function validateMenuSearch(search: Record<string, unknown>): MenuSearch {
  const raw = Array.isArray(search.menu) ? search.menu[0] : search.menu;
  if (typeof raw !== "string") return {};
  const menu = raw.trim();
  return menu ? { menu } : {};
}

/**
 * Slug enviado em `/products/`, `/categories/` e no pedido.
 * O cardápio padrão é omitido: a API devolve o mesmo catálogo de antes.
 */
export function catalogMenuParam(
  menus: PublicMenu[] | undefined,
  requested: string | undefined,
): string | null {
  const slug = requested?.trim() || "";
  if (!slug) return null;
  if (!menus) return slug;

  const match = menus.find((menu) => menu.slug === slug);
  if (!match) return slug;
  return match.is_default ? null : match.slug;
}

export function resolveActiveMenu(
  menus: PublicMenu[] | undefined,
  requested: string | undefined,
): PublicMenu | null {
  if (!menus?.length) return null;
  if (requested) {
    return menus.find((menu) => menu.slug === requested) ?? null;
  }
  return menus.find((menu) => menu.is_default) ?? menus[0] ?? null;
}

export function menuHref(menu: string | undefined, category?: string): string {
  const path = category ? `/menu/${category}` : "/menu";
  if (!menu) return path;
  return `${path}?menu=${encodeURIComponent(menu)}`;
}
