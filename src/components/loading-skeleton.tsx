import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export function MediaGridSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-64 bg-zinc-800" />

      <div className="space-y-6">
        <div className="flex gap-2">
          <Skeleton className="h-10 w-32 bg-zinc-800" />
          <Skeleton className="h-10 w-32 bg-zinc-800" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <Card key={i} className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-4 space-y-2">
                <Skeleton className="h-4 w-full bg-zinc-800" />
                <Skeleton className="h-4 w-2/3 bg-zinc-800" />
                <Skeleton className="h-3 w-1/3 bg-zinc-800" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
