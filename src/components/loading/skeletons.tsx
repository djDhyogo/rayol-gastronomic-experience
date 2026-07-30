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
    <div className="space-y-2" aria-hidden="true">
      <div className="h-3 w-20 rounded-sm bg-transparent" />
      <div className="scroll-rail -mx-4 px-4">
        <div className="flex w-max flex-col gap-2.5">
          <div className="flex gap-2.5">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={`top-${index}`} className="shimmer h-11 w-28 rounded-full" />
            ))}
          </div>
          <div className="flex gap-2.5">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={`bottom-${index}`} className="shimmer h-11 w-28 rounded-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
