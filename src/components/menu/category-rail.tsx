import { Link } from "@tanstack/react-router";
import type { Category } from "@/types/catalog";
import { cn } from "@/lib/utils";

interface CategoryRailProps {
  categories: Category[];
  activeSlug: string | null;
}

export function CategoryRail({ categories, activeSlug }: CategoryRailProps) {
  return (
    <nav aria-label="Categorias do cardápio">
      <ul className="scroll-rail -mx-4 flex gap-2 px-4 pb-1">
        <li>
          <Link
            to="/menu"
            className={cn(
              "inline-flex min-h-9 items-center rounded-full border px-4 text-xs tracking-[0.12em] whitespace-nowrap uppercase transition-colors",
              activeSlug === null
                ? "border-brand-navy bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:border-brand-clay/40 hover:text-foreground",
            )}
          >
            Todos
          </Link>
        </li>
        {categories.map((category) => (
          <li key={category.id}>
            <Link
              to="/menu/$categoria"
              params={{ categoria: category.slug }}
              className={cn(
                "inline-flex min-h-9 items-center rounded-full border px-4 text-xs tracking-[0.12em] whitespace-nowrap uppercase transition-colors",
                activeSlug === category.slug
                  ? "border-brand-navy bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:border-brand-clay/40 hover:text-foreground",
              )}
            >
              {category.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
