import { Search, X } from "lucide-react";

interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  resultCount?: number;
}

export function SearchField({ value, onChange, resultCount }: SearchFieldProps) {
  return (
    <div>
      <label htmlFor="menu-search" className="sr-only">
        Buscar no cardápio
      </label>
      <div className="relative">
        <Search
          className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <input
          id="menu-search"
          type="search"
          inputMode="search"
          autoComplete="off"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Buscar prato, bebida ou categoria"
          className="min-h-11 w-full rounded-full border border-border bg-card pr-11 pl-11 text-sm text-foreground transition-colors outline-none placeholder:text-muted-foreground focus:border-brand-clay/50"
        />
        {value ? (
          <button
            type="button"
            onClick={() => onChange("")}
            aria-label="Limpar busca"
            className="absolute top-1/2 right-2 grid size-9 -translate-y-1/2 place-items-center rounded-full text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        ) : null}
      </div>
      <p aria-live="polite" className="sr-only">
        {resultCount === undefined ? "" : `${resultCount} itens encontrados`}
      </p>
    </div>
  );
}
