import type { z } from "zod";
import type { categorySchema, productSchema } from "@/schemas/catalog";

export type ApiCategory = z.infer<typeof categorySchema>;
export type ApiProduct = z.infer<typeof productSchema>;

export type ProductBadge = "Promoção" | "Happy Hour" | "Chef recomenda" | "Novidade";

export interface Product {
  id: string;
  code: string | null;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  priceLabel: string;
  sellType: string | null;
  categoryId: string | null;
  categoryName: string;
  categorySlug: string;
  badges: ProductBadge[];
  searchIndex: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  position: number;
  count: number;
}

export interface Catalog {
  products: Product[];
  categories: Category[];
}
