interface ListPriceProps {
  priceLabel: string;
  className?: string;
}

export function ListPrice({ priceLabel, className }: ListPriceProps) {
  return (
    <span
      className={
        className ??
        "shrink-0 font-display text-xl leading-none text-brand-clay tabular-nums sm:text-2xl"
      }
    >
      {priceLabel}
    </span>
  );
}
