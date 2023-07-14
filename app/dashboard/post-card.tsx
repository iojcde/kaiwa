import { Post } from "@prisma/client"
import Link from "next/link"
import { PostOperations } from "./post-operations"
import { Skeleton } from "@/components/ui/skeleton"

export const PostCard = ({ post }: { post: Post }) => (
  <div className="flex w-full items-center justify-between p-4">
    <div className="flex flex-col">
      <Link
        href={`/editor/${post.id}`}
        className="font-3xl font-semibold tracking-tight hover:underline"
      >
        {post.title != "" ? post.title : "Untitled Post"}
      </Link>
      <span className="text-sm text-gray-10">
        {new Date(post.updatedAt).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })}
      </span>
    </div>
    <PostOperations post={post} />
  </div>
)

PostCard.Skeleton = function PostItemSkeleton() {
  return (
    <div className="p-4">
      <div className="space-y-3">
        <Skeleton className="h-5 w-2/5" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </div>
  )
}
