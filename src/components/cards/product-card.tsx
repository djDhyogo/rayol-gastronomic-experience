import { motion, useReducedMotion } from "framer-motion";
import type { Product } from "@/types/catalog";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  index?: number;
  compact?: boolean;
  disableEntranceAnimation?: boolean;
}

export function ProductCard({
  product,
  onSelect,
  index = 0,
  compact = false,
  disableEntranceAnimation = false,
}: ProductCardProps) {
  const reduceMotion = useReducedMotion();
  const initial = product.name.trim().charAt(0).toLocaleUpperCase("pt-BR");

  return (
    <motion.article
      initial={disableEntranceAnimation || reduceMotion ? false : { opacity: 0, y: 12 }}
      whileInView={disableEntranceAnimation || reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={disableEntranceAnimation ? undefined : { once: true, margin: "-40px" }}
      transition={
        disableEntranceAnimation
          ? undefined
          : { duration: 0.45, delay: Math.min(index * 0.04, 0.24), ease: [0.16, 1, 0.3, 1] }
      }
      className={cn("h-full", compact && "w-64 shrink-0 sm:w-72")}
    >
      <button
        type="button"
        onClick={() => onSelect(product)}
        aria-label={`Ver detalhes de ${product.name}`}
        className="group flex h-full w-full flex-col rounded-lg border border-border bg-card p-5 text-left transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-0.5 hover:border-brand-clay/30 hover:shadow-[var(--shadow-lift)]"
      >
        <div className="relative flex h-28 items-center justify-center overflow-hidden rounded-md bg-secondary">
          <span
            aria-hidden="true"
            className="font-display text-6xl leading-none text-brand-navy/12 transition-transform duration-500 group-hover:scale-105"
          >
            {initial}
          </span>
          {product.badges.length > 0 ? (
            <span className="absolute top-2 left-2 rounded-full bg-brand-clay px-2.5 py-1 text-[0.6rem] font-medium tracking-[0.14em] text-primary-foreground uppercase">
              {product.badges[0]}
            </span>
          ) : null}
        </div>

        <p className="eyebrow mt-4">{product.categoryName}</p>
        <h3 className="mt-2 font-display text-lg leading-snug text-foreground">{product.name}</h3>

        {product.shortDescription ? (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {product.shortDescription}
          </p>
        ) : null}

        <div className="mt-auto flex items-end justify-between pt-5">
          <span className="font-display text-lg text-brand-clay">{product.priceLabel}</span>
          <span className="text-[0.65rem] tracking-[0.18em] text-muted-foreground uppercase">
            Ver detalhes
          </span>
        </div>
      </button>
    </motion.article>
  );
}
