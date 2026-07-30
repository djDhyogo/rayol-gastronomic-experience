import type { MenuFilters, SortMode } from "@/hooks/use-menu-filters";
import { formatPrice } from "@/utils/format";

interface FilterBarProps {
  filters: MenuFilters;
  onChange: (patch: Partial<MenuFilters>) => void;
  bounds: [number, number];
}

const SORT_LABELS: Record<SortMode, string> = {
  curated: "Sugerido",
  "price-asc": "Menor preço",
  "price-desc": "Maior preço",
  name: "A — Z",
};

export function FilterBar({ filters, onChange, bounds }: FilterBarProps) {
  const [min, max] = bounds;
  const current = filters.maxPrice ?? max;

  return (
    <div className="flex flex-col gap-4 border-t border-border pt-4">
      <div className="flex items-center justify-between gap-3">
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
