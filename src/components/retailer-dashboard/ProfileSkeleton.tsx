import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileSkeleton() {
  return (
    <div className="min-h-[calc(100vh-72px)] space-y-4 bg-[#3b2918] p-3 sm:p-5" aria-label="Loading profile">
      <section className="overflow-hidden rounded-lg bg-[#261407]">
        <Skeleton className="h-32 rounded-none bg-[#6a4b29]" />
        <div className="flex items-end gap-3 px-4 pb-4">
          <Skeleton className="-mt-10 h-16 w-16 bg-[#735630]" />
          <div className="space-y-2"><Skeleton className="h-5 w-44 bg-[#735630]"/><Skeleton className="h-3 w-56 bg-[#735630]"/></div>
        </div>
      </section>
      {[0, 1].map((section) => (
        <section key={section} className="rounded-lg bg-[#59401f] p-4">
          <Skeleton className="mb-5 h-5 w-40 bg-[#80613a]" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[0, 1, 2, 3].map((field) => <div key={field} className="space-y-2"><Skeleton className="h-3 w-24 bg-[#80613a]"/><Skeleton className="h-10 w-full bg-[#6d512f]"/></div>)}
          </div>
        </section>
      ))}
    </div>
  );
}
