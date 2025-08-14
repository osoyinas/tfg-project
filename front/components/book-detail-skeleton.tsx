import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function BookDetailSkeleton() {
  return (
    <div className={cn(" mx-auto px-4 py-8 bg-dark-book-bg text-dark-foreground min-h-screen w-full")}> 
      <div className="grid md:grid-cols-3 gap-8 container">
        <div className="md:col-span-1 flex justify-center">
          <Skeleton className="w-[300px] h-[450px] rounded-lg" />
        </div>
        <div className="md:col-span-2">
          <Skeleton className="h-10 w-2/3 mb-2 rounded" />
          <Skeleton className="h-6 w-1/2 mb-4 rounded" />
          <div className="flex items-center gap-4 mb-6">
            <Skeleton className="h-8 w-24 rounded" />
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-8 w-32 rounded" />
          </div>
          <Skeleton className="h-20 w-full mb-6 rounded" />
          <div className="grid grid-cols-2 gap-4 mb-6">
            <Skeleton className="h-6 w-24 rounded" />
            <Skeleton className="h-6 w-24 rounded" />
          </div>
          <Skeleton className="h-8 w-1/3 mb-4 rounded" />
          <Skeleton className="h-16 w-full rounded" />
        </div>
      </div>
    </div>
  );
}
