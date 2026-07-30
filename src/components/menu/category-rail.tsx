import { Link } from "@tanstack/react-router";
import type { Category } from "@/types/catalog";
import { HIDDEN_CATEGORY_SLUGS, CATEGORY_ORDER } from "@/constants/restaurant";
import { cn } from "@/lib/utils";

interface CategoryRailProps {
  categories: Category[];
  activeSlug: string | null;
}

type RailItem = { kind: "all" } | { kind: "category"; category: Category };

function chipClass(active: boolean) {
  return cn(
    "inline-flex min-h-11 items-center justify-center rounded-full border px-4 text-xs tracking-[0.12em] whitespace-nowrap uppercase transition-colors",
    active
      ? "border-brand-navy bg-primary text-primary-foreground"
      : "border-border bg-card text-muted-foreground hover:border-brand-clay/40 hover:text-foreground",
  );
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

function splitIntoTwoRows(items: RailItem[]): [RailItem[], RailItem[]] {
  const mid = Math.ceil(items.length / 2);
  return [items.slice(0, mid), items.slice(mid)];
}

function RailChip({ item, activeSlug }: { item: RailItem; activeSlug: string | null }) {
  if (item.kind === "all") {
    return (
      <Link to="/menu" className={chipClass(activeSlug === null)}>
        Todos
      </Link>
    );
  }

  return (
    <Link
      to="/menu/$categoria"
      params={{ categoria: item.category.slug }}
      className={chipClass(activeSlug === item.category.slug)}
    >
      {item.category.name}
    </Link>
  );
}

export function CategoryRail({ categories, activeSlug }: CategoryRailProps) {
  const [rowTop, rowBottom] = splitIntoTwoRows(buildRailItems(categories));

  return (
    <nav aria-label="Categorias do cardápio" className="space-y-2">
      <p className="text-[0.62rem] tracking-[0.18em] text-muted-foreground uppercase">Categorias</p>
      <div className="scroll-rail -mx-4 px-4 pb-1">
        <div className="flex w-max flex-col gap-2.5">
          <ul className="flex gap-2.5">
            {rowTop.map((item) => (
              <li key={item.kind === "all" ? "all" : item.category.id}>
                <RailChip item={item} activeSlug={activeSlug} />
              </li>
            ))}
          </ul>
          {rowBottom.length > 0 ? (
            <ul className="flex gap-2.5">
              {rowBottom.map((item) => (
                <li key={item.kind === "all" ? "all" : item.category.id}>
                  <RailChip item={item} activeSlug={activeSlug} />
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </nav>
  );
}
