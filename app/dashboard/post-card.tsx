import { Post } from "@prisma/client";
import Link from "next/link";

export const PostCard = ({ post }: { post: Post }) => (
  <div className="w-full p-4">
    <Link
      href={`/editor/${post.id}`}
      className="font-3xl font-semibold tracking-tight hover:underline"
    >
      {post.title}
    </Link>
    <p></p>
    <span className="text-sm text-gray-10">
      {post.updatedAt.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })}
    </span>
  </div>
);
