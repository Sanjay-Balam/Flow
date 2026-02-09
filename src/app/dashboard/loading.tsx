import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Skeleton className="h-10 w-72 mb-2" />
      <Skeleton className="h-5 w-48 mb-8" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border rounded-lg p-6">
            <Skeleton className="h-8 w-8 mb-2" />
            <Skeleton className="h-8 w-16 mb-1" />
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
      </div>
      <Skeleton className="h-6 w-32 mb-4" />
      {[1, 2, 3].map((i) => (
        <div key={i} className="border rounded-lg p-4 mb-3">
          <Skeleton className="h-5 w-64 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
      ))}
    </div>
  );
}
