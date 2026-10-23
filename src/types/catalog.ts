import type { z } from "zod";
import type { categorySchema, menuSchema, productSchema } from "@/schemas/catalog";

export type ApiCategory = z.infer<typeof categorySchema>;
export type ApiProduct = z.infer<typeof productSchema>;
export type PublicMenu = z.infer<typeof menuSchema>;

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
  position: number;
  badges: ProductBadge[];
  imageUrl: string | null;
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
