import { Skeleton } from "@/components/ui/skeleton";

export default function FeatureManagementSkeleton() {
  return <div className="min-h-[calc(100vh-72px)] space-y-3 bg-[#3b2918] p-3 sm:p-4" aria-label="Loading inventory feature management">
    <Skeleton className="h-9 w-56 bg-[#513719]"/>
    {[0, 1, 2, 3, 4].map(item => <Skeleton key={item} className="h-[104px] rounded-lg bg-[#513719]"/>)}
  </div>;
}
