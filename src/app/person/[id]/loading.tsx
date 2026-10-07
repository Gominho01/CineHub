import { SkeletonBox, SkeletonCarouselRow } from "@/components/Skeleton";

export default function PersonDetailLoading() {
  return (
    <div>
      <div className="grid gap-8 md:grid-cols-[240px_1fr]">
        <div className="aspect-[2/3] animate-pulse rounded-lg bg-white/5" />

        <div>
          <SkeletonBox className="h-8 w-1/2" />
          <SkeletonBox className="mt-2 h-4 w-1/3" />
          <SkeletonBox className="mt-6 h-4 w-full max-w-2xl" />
          <SkeletonBox className="mt-2 h-4 w-5/6 max-w-2xl" />
        </div>
      </div>

      <div className="mt-8">
        <SkeletonCarouselRow />
      </div>
    </div>
  );
}
