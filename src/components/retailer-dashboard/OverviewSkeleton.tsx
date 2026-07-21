import { Skeleton } from "@/components/ui/skeleton";

export default function OverviewSkeleton() {
  return <div className="space-y-6 p-3 sm:p-4" aria-label="Loading Today dashboard"><div className="space-y-2"><Skeleton className="h-8 w-72 bg-[#513719]"/><Skeleton className="h-4 w-96 max-w-full bg-[#513719]"/></div><div className="grid grid-cols-2 gap-3 xl:grid-cols-4">{Array.from({ length: 4 }, (_, item) => <Skeleton key={item} className="h-[108px] bg-[#513719]"/>)}</div><Skeleton className="h-6 w-44 bg-[#513719]"/><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }, (_, item) => <Skeleton key={item} className="h-[150px] bg-[#513719]"/>)}</div></div>;
}
