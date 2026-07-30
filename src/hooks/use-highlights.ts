import { useMemo } from "react";
import type { Catalog, Product } from "@/types/catalog";
import { HAPPY_HOUR_SLUG, PROMO_SLUG } from "@/constants/restaurant";

export interface Highlight {
  id: string;
  title: string;
  subtitle: string;
  products: Product[];
}

const MAX_ITEMS = 8;

export function useHighlights(catalog: Catalog | undefined): Highlight[] {
  return useMemo(() => {
    if (!catalog?.products.length) return [];
    const { products } = catalog;

    const candidates: Highlight[] = [
      {
        id: "promocoes",
        title: "Promoções do dia",
        subtitle: "Seleção especial válida enquanto durar o serviço",
        products: products.filter((product) => product.categorySlug === PROMO_SLUG),
      },
      {
        id: "happy-hour",
        title: "Happy Hour",
        subtitle: "Para acompanhar o fim de tarde",
        products: products.filter((product) => product.categorySlug === HAPPY_HOUR_SLUG),
      },
      {
        id: "chef",
        title: "Chef recomenda",
        subtitle: "Pratos assinados com nossa melhor história",
        products: products.filter((product) => product.badges.includes("Chef recomenda")),
      },
      {
        id: "novidades",
        title: "Novidades",
        subtitle: "Recém-chegados à nossa cozinha",
        products: products.filter((product) => product.badges.includes("Novidade")),
      },
    ];

    return candidates
      .filter((highlight) => highlight.products.length >= 2)
      .map((highlight) => ({ ...highlight, products: highlight.products.slice(0, MAX_ITEMS) }));
  }, [catalog]);
}
