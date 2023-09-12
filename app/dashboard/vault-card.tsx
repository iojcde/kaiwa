
import Link from "next/link" 
import { Skeleton } from "@/components/ui/skeleton"

export const WorkspaceCard = ({
  vault: vault,
}: {
  vault: {
    id: number
    name: string
    slug: string
    _count: {
      files: number
    }
  }
}) => {
  const fileCount = vault._count.files
  return (
    <div className="flex w-full items-center justify-between bg-background p-4">
      <div className="flex flex-col">
        <Link
          href={`/editor/${vault.slug}`}
          className="font-3xl font-semibold tracking-tight hover:underline"
        >
          {vault.name}
        </Link>
        <span className="font-gray-10 font-mono text-xs">
          /editor/{vault.slug}
        </span>

        <span>
          {fileCount} {fileCount == 1 ? "file" : "files"}
        </span>
      </div>
    </div>
  )
}
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
