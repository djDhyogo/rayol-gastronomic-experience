import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import type { MenuFilters, SortMode } from "@/hooks/use-menu-filters";
import { formatPrice } from "@/utils/format";
import { cn } from "@/lib/utils";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

interface FilterBarProps {
  filters: MenuFilters;
  onChange: (patch: Partial<MenuFilters>) => void;
  bounds: [number, number];
}

const SORT_OPTIONS: { value: SortMode; label: string; hint: string }[] = [
  { value: "curated", label: "Sugerido", hint: "Ordem do cardápio" },
  { value: "price-asc", label: "Menor preço", hint: "Do mais barato ao mais caro" },
  { value: "price-desc", label: "Maior preço", hint: "Do mais caro ao mais barato" },
  { value: "name", label: "A — Z", hint: "Ordem alfabética" },
];

export function FilterBar({ filters, onChange, bounds }: FilterBarProps) {
  const [sortOpen, setSortOpen] = useState(false);
  const [min, max] = bounds;
  const current = filters.maxPrice ?? max;
  const activeSort = SORT_OPTIONS.find((option) => option.value === filters.sort) ?? SORT_OPTIONS[0];

  const selectSort = (value: SortMode) => {
    onChange({ sort: value });
    setSortOpen(false);
  };

  return (
    <div className="flex flex-col gap-4 border-t border-border pt-4">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[0.62rem] tracking-[0.18em] text-muted-foreground uppercase">
          Ordenar
        </span>

        <Drawer open={sortOpen} onOpenChange={setSortOpen} shouldScaleBackground={false}>
          <DrawerTrigger asChild>
            <button
              type="button"
              aria-haspopup="dialog"
              aria-expanded={sortOpen}
              className="inline-flex min-h-11 max-w-[70%] items-center gap-2 rounded-full border border-border bg-card px-4 text-left text-sm text-foreground transition-colors hover:border-brand-clay/40"
            >
              <span className="truncate">{activeSort.label}</span>
              <ChevronDown
                className={cn(
                  "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
                  sortOpen && "rotate-180",
                )}
                aria-hidden="true"
              />
            </button>
          </DrawerTrigger>

          <DrawerContent className="border-border bg-card pb-[max(1.5rem,env(safe-area-inset-bottom))]">
            <DrawerHeader className="border-b border-border pb-4 text-left">
              <DrawerTitle className="font-display text-xl text-foreground">Ordenar por</DrawerTitle>
              <p className="text-sm text-muted-foreground">Escolha como os itens aparecem</p>
            </DrawerHeader>

            <ul className="flex flex-col px-2 py-2" role="listbox" aria-label="Opções de ordenação">
              {SORT_OPTIONS.map((option) => {
                const selected = option.value === filters.sort;
                return (
                  <li key={option.value}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={selected}
                      onClick={() => selectSort(option.value)}
                      className={cn(
                        "flex min-h-14 w-full items-center gap-3 rounded-lg px-4 text-left transition-colors",
                        selected
                          ? "bg-secondary text-foreground"
                          : "text-foreground active:bg-secondary/70",
                      )}
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-medium">{option.label}</span>
                        <span className="mt-0.5 block text-xs text-muted-foreground">
                          {option.hint}
                        </span>
                      </span>
                      <Check
                        className={cn(
                          "size-5 shrink-0 text-brand-clay transition-opacity",
                          selected ? "opacity-100" : "opacity-0",
                        )}
                        aria-hidden="true"
                      />
                    </button>
                  </li>
                );
              })}
            </ul>
          </DrawerContent>
        </Drawer>
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
