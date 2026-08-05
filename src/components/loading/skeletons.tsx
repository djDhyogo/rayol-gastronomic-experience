interface SkeletonGridProps {
  count?: number;
}

function ProductCardSkeleton() {
  return (
    <div className="rounded-lg border border-border bg-card p-5" aria-hidden="true">
      <div className="shimmer h-32 w-full rounded-md" />
      <div className="shimmer mt-5 h-4 w-3/5 rounded-sm" />
      <div className="shimmer mt-3 h-3 w-full rounded-sm" />
      <div className="shimmer mt-2 h-3 w-4/5 rounded-sm" />
      <div className="shimmer mt-5 h-4 w-20 rounded-sm" />
    </div>
  );
}

export function ProductGridSkeleton({ count = 6 }: SkeletonGridProps) {
  return (
    <div
      role="status"
      aria-label="Carregando pratos"
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}

export function CategoryRailSkeleton() {
  return (
    <div aria-hidden="true" className="scroll-rail flex gap-2.5 sm:gap-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="shimmer aspect-square w-[calc((100%-1.875rem)/4.4)] shrink-0 rounded-lg sm:w-[5.75rem] md:w-[6.25rem]"
        />
      ))}
    </div>
  );
}
