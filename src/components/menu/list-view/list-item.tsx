import type { Product } from "@/types/catalog";
import { ListPrice } from "@/components/menu/list-view/list-price";

interface ListItemProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export function ListItem({ product, onSelect }: ListItemProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(product)}
      aria-label={`Ver detalhes de ${product.name}`}
      className="flex w-full min-h-11 items-center gap-3 py-4 text-left transition-colors hover:bg-secondary/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring sm:gap-6"
    >
      {product.imageUrl ? (
        <img
          src={product.imageUrl}
          alt=""
          loading="lazy"
          className="size-14 shrink-0 rounded-md object-cover object-[82%_center] sm:size-16"
        />
      ) : null}
      <div className="min-w-0 flex-1">
        <h3 className="font-display text-base leading-snug text-foreground sm:text-lg">
          {product.name}
        </h3>
        {product.shortDescription ? (
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
            {product.shortDescription}
          </p>
        ) : null}
      </div>
      <ListPrice priceLabel={product.priceLabel} />
    </button>
  );
}
