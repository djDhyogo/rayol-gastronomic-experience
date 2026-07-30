import type { MenuFilters, SortMode } from "@/hooks/use-menu-filters";
import { formatPrice } from "@/utils/format";
import { cn } from "@/lib/utils";

interface FilterBarProps {
  filters: MenuFilters;
  onChange: (patch: Partial<MenuFilters>) => void;
  bounds: [number, number];
  hasPromo: boolean;
  hasHappyHour: boolean;
}

const SORT_LABELS: Record<SortMode, string> = {
  curated: "Sugerido",
  "price-asc": "Menor preço",
  "price-desc": "Maior preço",
  name: "A — Z",
};

function Toggle({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "inline-flex min-h-9 items-center rounded-full border px-4 text-xs tracking-[0.12em] uppercase transition-colors",
        active
          ? "border-brand-clay bg-accent text-accent-foreground"
          : "border-border bg-card text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

export function FilterBar({ filters, onChange, bounds, hasPromo, hasHappyHour }: FilterBarProps) {
  const [min, max] = bounds;
  const current = filters.maxPrice ?? max;

  return (
    <div className="flex flex-col gap-4">
      <div className="scroll-rail -mx-4 flex items-center gap-2 px-4">
        {hasPromo ? (
          <Toggle
            active={filters.onlyPromo}
            onClick={() => onChange({ onlyPromo: !filters.onlyPromo, onlyHappyHour: false })}
          >
            Promoções
          </Toggle>
        ) : null}
        {hasHappyHour ? (
          <Toggle
            active={filters.onlyHappyHour}
            onClick={() => onChange({ onlyHappyHour: !filters.onlyHappyHour, onlyPromo: false })}
          >
            Happy Hour
          </Toggle>
        ) : null}

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <label
            htmlFor="menu-sort"
            className="text-[0.62rem] tracking-[0.18em] text-muted-foreground uppercase"
          >
            Ordenar
          </label>
          <select
            id="menu-sort"
            value={filters.sort}
            onChange={(event) => onChange({ sort: event.target.value as SortMode })}
            className="min-h-9 rounded-full border border-border bg-card px-3 text-xs text-foreground outline-none"
          >
            {Object.entries(SORT_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <label
          htmlFor="menu-price"
          className="shrink-0 text-[0.62rem] tracking-[0.18em] text-muted-foreground uppercase"
        >
          Até {formatPrice(current)}
        </label>
        <input
          id="menu-price"
          type="range"
          min={min}
          max={max}
          step={1}
          value={current}
          onChange={(event) => {
            const value = Number(event.target.value);
            onChange({ maxPrice: value >= max ? null : value });
          }}
          className="h-1 w-full cursor-pointer appearance-none rounded-full bg-border accent-brand-clay"
        />
      </div>
    </div>
  );
}
