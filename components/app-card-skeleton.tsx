import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function AppCardSkeleton() {
  return (
    <Card className="overflow-hidden shadow-lg border-2">
      <CardHeader className="pb-4">
        <div className="flex items-start space-x-4">
          <Skeleton className="w-16 h-16 rounded-md" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2 space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-1/3" />
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-32" />
          </div>
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-10 w-full" />
        </div>
      </CardContent>
    </Card>
  )
}
