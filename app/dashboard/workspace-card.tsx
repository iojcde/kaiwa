import { Post, Workspace } from "@prisma/client"
import Link from "next/link"
import { PostOperations } from "./post-operations"
import { Skeleton } from "@/components/ui/skeleton"

export const WorkspaceCard = ({ workspace: ws }: { workspace: Workspace }) => (
  <div className="flex w-full items-center justify-between bg-background p-4">
    <div className="flex flex-col">
      <Link
        href={`/editor/${ws.slug}`}
        className="font-3xl font-semibold tracking-tight hover:underline"
      >
        {ws.name}
      </Link>
    </div>
  </div>
)

WorkspaceCard.Skeleton = function PostItemSkeleton() {
  return (
    <div className="p-4">
      <div className="space-y-3">
        <Skeleton className="h-5 w-2/5" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </div>
  )
}
