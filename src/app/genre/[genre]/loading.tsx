import { SkeletonBox, SkeletonGrid } from "@/components/Skeleton";

export default function GenreLoading() {
  return (
    <div>
      <SkeletonBox className="mb-6 h-8 w-40" />
      <SkeletonGrid />
    </div>
  );
}
