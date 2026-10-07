import { SkeletonGrid } from "@/components/Skeleton";

export default function SearchLoading() {
  return (
    <div>
      <div className="h-10 w-full animate-pulse rounded-md bg-white/5" />
      <div className="my-4 h-10 w-full max-w-md animate-pulse rounded-md bg-white/5" />
      <SkeletonGrid />
    </div>
  );
}
