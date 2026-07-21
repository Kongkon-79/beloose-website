import { Skeleton } from "@/components/ui/skeleton";

export default function HumidorSkeleton() {
  return <div className="space-y-4 p-3 sm:p-4" aria-label="Loading humidors"><div className="flex justify-end"><Skeleton className="h-10 w-40 bg-[#513719]"/></div>{[0, 1, 2].map(item => <Skeleton key={item} className="h-56 rounded-lg bg-[#34200e]"/>)}</div>;
}
