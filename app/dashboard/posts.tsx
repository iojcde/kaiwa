import { db } from "@/lib/db";
import { PostCard } from "./post-card";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const Posts = async () => {
  const session = await getServerSession(authOptions);

  const posts = await db.post.findMany({
    where: { authorId: session?.user.id },
  });

  return (
    <div className="rounded-lg border divide-border mt-8 divide-y ">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};
export const dynamic = "force-dynamic";
