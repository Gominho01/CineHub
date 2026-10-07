import { SkeletonCarouselRow } from "@/components/Skeleton";

export default function HomeLoading() {
  return (
    <div>
      <SkeletonCarouselRow />
      <SkeletonCarouselRow />
      <SkeletonCarouselRow />
      <SkeletonCarouselRow />
    </div>
  );
}
