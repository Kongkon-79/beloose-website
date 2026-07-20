import { Skeleton } from "@/components/ui/skeleton";

export default function OverviewSkeleton() {
  return <div className="space-y-4 p-3 sm:p-4" aria-label="Loading dashboard overview"><Skeleton className="h-28 w-full bg-[#61401f]"/><div className="grid grid-cols-2 gap-3 xl:grid-cols-4">{[0,1,2,3].map(item => <Skeleton key={item} className="h-28 bg-[#513719]"/>)}</div><div className="grid gap-4 lg:grid-cols-2"><Skeleton className="h-72 bg-[#513719]"/><Skeleton className="h-72 bg-[#513719]"/></div></div>;
}
