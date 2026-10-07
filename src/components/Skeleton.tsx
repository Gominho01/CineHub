export function SkeletonBox({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-white/10 ${className}`} />;
}

export function SkeletonCard() {
  return (
    <div className="w-40 shrink-0 sm:w-48">
      <div className="aspect-[2/3] animate-pulse rounded-lg bg-white/5" />
      <SkeletonBox className="mt-2 h-4 w-3/4" />
      <SkeletonBox className="mt-1 h-3 w-1/3" />
    </div>
  );
}

export function SkeletonCarouselRow({ cards = 6 }: { cards?: number }) {
  return (
    <section className="mb-10">
      <SkeletonBox className="mb-3 h-[1.125rem] w-40" />
      <div className="flex gap-4 overflow-x-auto pb-2">
        {Array.from({ length: cards }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </section>
  );
}

export function SkeletonGridCard() {
  return (
    <div>
      <div className="aspect-[2/3] animate-pulse rounded-lg bg-white/5" />
      <SkeletonBox className="mt-2 h-4 w-3/4" />
      <SkeletonBox className="mt-1 h-3 w-1/3" />
    </div>
  );
}

export function SkeletonGrid({ items = 10 }: { items?: number }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {Array.from({ length: items }).map((_, i) => (
        <SkeletonGridCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonDetailPage() {
  return (
    <div>
      <div className="relative -mx-6 mb-8 aspect-[16/6] overflow-hidden">
        <div className="h-full w-full animate-pulse bg-white/5" />
      </div>

      <div className="grid gap-8 md:grid-cols-[240px_1fr]">
        <div className="aspect-[2/3] animate-pulse rounded-lg bg-white/5" />

        <div>
          <SkeletonBox className="h-8 w-2/3" />
          <SkeletonBox className="mt-3 h-4 w-1/3" />
          <SkeletonBox className="mt-6 h-4 w-full max-w-2xl" />
          <SkeletonBox className="mt-2 h-4 w-5/6 max-w-2xl" />
          <SkeletonBox className="mt-2 h-4 w-3/4 max-w-2xl" />
        </div>
      </div>

      <div className="mt-8">
        <SkeletonCarouselRow />
      </div>
    </div>
  );
}
