import { LayoutGrid, List } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export type MenuViewMode = "cards" | "list";

interface ViewModeToggleProps {
  value: MenuViewMode;
  onChange: (value: MenuViewMode) => void;
}

export function ViewModeToggle({ value, onChange }: ViewModeToggleProps) {
  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={(next) => {
        if (next === "cards" || next === "list") onChange(next);
      }}
      variant="outline"
      size="sm"
      aria-label="Forma de visualizar o cardápio"
      className="justify-end gap-0 overflow-hidden rounded-md border border-border"
    >
      <ToggleGroupItem
        value="cards"
        aria-label="Visualização em fotos"
        className="min-h-11 gap-1.5 rounded-none border-0 px-3 text-[0.65rem] tracking-[0.14em] text-brand-navy uppercase hover:bg-brand-clay hover:text-accent-foreground data-[state=on]:bg-brand-navy data-[state=on]:text-primary-foreground data-[state=on]:hover:bg-brand-navy data-[state=on]:hover:text-primary-foreground"
      >
        <LayoutGrid className="size-3.5" aria-hidden="true" />
        Fotos
      </ToggleGroupItem>
      <ToggleGroupItem
        value="list"
        aria-label="Visualização em lista"
        className="min-h-11 gap-1.5 rounded-none border-0 border-l border-border px-3 text-[0.65rem] tracking-[0.14em] text-brand-navy uppercase hover:bg-brand-clay hover:text-accent-foreground data-[state=on]:bg-brand-navy data-[state=on]:text-primary-foreground data-[state=on]:hover:bg-brand-navy data-[state=on]:hover:text-primary-foreground"
      >
        <List className="size-3.5" aria-hidden="true" />
        Lista
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
