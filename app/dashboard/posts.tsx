import { db } from "@/lib/db";
import { PostCard } from "./post-card";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const Posts = async () => {
  const session = await getServerSession(authOptions);

  const posts = await db.post.findMany({
    where: { authorId: session?.user.id },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="rounded-lg border overflow-clip divide-border mt-8 divide-y ">
      {posts.length > 0 ? (
        posts.map((post) => <PostCard key={post.id} post={post} />)
      ) : (
        <div className="shadow-inner bg-gray-2 p-8 rounded-lg text-gray-11">
          No posts yet...
        </div>
      )}
    </div>
  );
};