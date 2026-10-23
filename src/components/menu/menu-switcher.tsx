import type { PublicMenu } from "@/types/catalog";
import { cn } from "@/lib/utils";

interface MenuSwitcherProps {
  menus: PublicMenu[];
  activeSlug: string | null;
  onSelect: (menu: PublicMenu) => void;
}

export function MenuSwitcher({ menus, activeSlug, onSelect }: MenuSwitcherProps) {
  if (menus.length < 2) return null;

  return (
    <nav aria-label="Cardápios" className="mt-6">
      <ul className="flex flex-wrap gap-2">
        {menus.map((menu) => {
          const active = menu.slug === activeSlug;
          return (
            <li key={menu.id}>
              <button
                type="button"
                aria-pressed={active}
                onClick={() => onSelect(menu)}
                className={cn(
                  "inline-flex min-h-10 items-center rounded-full border px-4 text-[0.68rem] tracking-[0.16em] uppercase transition-colors",
                  active
                    ? "border-brand-navy bg-brand-navy text-primary-foreground"
                    : "border-border bg-card text-muted-foreground hover:border-brand-clay hover:text-foreground",
                )}
              >
                {menu.name}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
