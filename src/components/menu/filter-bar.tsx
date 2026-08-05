import type { MenuFilters } from "@/hooks/use-menu-filters";
import { formatPrice } from "@/utils/format";

interface FilterBarProps {
  filters: MenuFilters;
  onChange: (patch: Partial<MenuFilters>) => void;
  bounds: [number, number];
}

export function FilterBar({ filters, onChange, bounds }: FilterBarProps) {
  const [min, max] = bounds;
  const current = filters.maxPrice ?? max;

  return (
    <div className="flex items-center gap-4 border-t border-border pt-4">
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
  );
}
