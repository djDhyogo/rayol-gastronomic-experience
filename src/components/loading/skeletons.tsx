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
    <div className="flex gap-2" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="shimmer h-9 w-28 shrink-0 rounded-full" />
      ))}
    </div>
  );
}
