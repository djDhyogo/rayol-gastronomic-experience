import { Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import {
  BadgePercent,
  CakeSlice,
  ConciergeBell,
  CookingPot,
  CupSoda,
  HandPlatter,
  LayoutGrid,
  Martini,
  Package,
  Salad,
  Smile,
  Soup,
  Utensils,
  Wine,
} from "lucide-react";
import type { Category } from "@/types/catalog";
import { HIDDEN_CATEGORY_SLUGS, CATEGORY_ORDER } from "@/constants/restaurant";
import { cn } from "@/lib/utils";

interface CategoryRailProps {
  categories: Category[];
  activeSlug: string | null;
}

type RailItem = { kind: "all" } | { kind: "category"; category: Category };

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  "promocao-do-dia": BadgePercent,
  "happy-hour": Martini,
  entradas: Soup,
  compartilhar: HandPlatter,
  individual: ConciergeBell,
  principais: ConciergeBell,
  tradicionais: CookingPot,
  sobremesas: CakeSlice,
  drinks: Wine,
  bebidas: CupSoda,
  kids: Smile,
  infantil: Smile,
  porcoes: Package,
  saladas: Salad,
  petiscos: Utensils,
};

function iconForSlug(slug: string): LucideIcon {
  if (CATEGORY_ICONS[slug]) return CATEGORY_ICONS[slug];
  const match = Object.entries(CATEGORY_ICONS).find(([key]) => slug.includes(key));
  return match?.[1] ?? Utensils;
}

function tileClass(active: boolean) {
  return cn(
    "group flex size-full flex-col items-center justify-center gap-1 rounded-lg border px-1.5 text-center transition-colors sm:gap-1.5 sm:px-2",
    active
      ? "border-brand-navy bg-brand-navy text-primary-foreground"
      : "border-border bg-card text-brand-navy hover:border-brand-clay hover:bg-brand-clay hover:text-accent-foreground active:border-brand-clay active:bg-brand-clay active:text-accent-foreground",
  );
}

function iconClass(active: boolean) {
  return cn(
    "size-5 shrink-0 stroke-[1.5] transition-colors sm:size-[1.35rem]",
    active
      ? "text-primary-foreground"
      : "text-brand-clay group-hover:text-accent-foreground group-active:text-accent-foreground",
  );
}

function labelClass() {
  return "line-clamp-2 text-[0.55rem] font-semibold leading-tight tracking-[0.05em] uppercase sm:text-[0.62rem] sm:tracking-[0.06em]";
}

function orderIndex(slug: string): number {
  const index = CATEGORY_ORDER.indexOf(slug as (typeof CATEGORY_ORDER)[number]);
  return index === -1 ? CATEGORY_ORDER.length : index;
}

function buildRailItems(categories: Category[]): RailItem[] {
  const visible = categories
    .filter((category) => !HIDDEN_CATEGORY_SLUGS.includes(category.slug))
    .sort(
      (a, b) => orderIndex(a.slug) - orderIndex(b.slug) || a.name.localeCompare(b.name, "pt-BR"),
    );

  return [{ kind: "all" }, ...visible.map((category) => ({ kind: "category" as const, category }))];
}

function RailTile({ item, activeSlug }: { item: RailItem; activeSlug: string | null }) {
  if (item.kind === "all") {
    const active = activeSlug === null;
    return (
      <Link to="/menu" className={tileClass(active)} aria-current={active ? "page" : undefined}>
        <LayoutGrid className={iconClass(active)} aria-hidden />
        <span className={labelClass()}>Todos</span>
      </Link>
    );
  }

  const Icon = iconForSlug(item.category.slug);
  const active = activeSlug === item.category.slug;

  return (
    <Link
      to="/menu/$categoria"
      params={{ categoria: item.category.slug }}
      className={tileClass(active)}
      aria-current={active ? "page" : undefined}
    >
      <Icon className={iconClass(active)} aria-hidden />
      <span className={labelClass()}>{item.category.name}</span>
    </Link>
  );
}

export function CategoryRail({ categories, activeSlug }: CategoryRailProps) {
  const items = buildRailItems(categories);

  return (
    <nav aria-label="Categorias do cardápio">
      {/*
        Overflow preview dentro das margens do container:
        - Mobile: ~4 cards + pedaço do próximo
        - sm+: largura fixa ideal; peek no overflow à direita
      */}
      <ul className="scroll-rail flex snap-x snap-mandatory gap-2.5 pb-1 sm:gap-3">
        {items.map((item) => (
          <li
            key={item.kind === "all" ? "all" : item.category.id}
            className="aspect-square w-[calc((100%-1.875rem)/4.4)] shrink-0 snap-start sm:w-[5.75rem] md:w-[6.25rem]"
          >
            <RailTile item={item} activeSlug={activeSlug} />
          </li>
        ))}
      </ul>
    </nav>
  );
}
