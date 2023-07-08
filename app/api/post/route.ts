import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";

const getPosts = async () => {
  const session = await getServerSession(authOptions);

  const posts = await db.post.findMany({
    where: { authorId: session?.user.id },
    orderBy: { updatedAt: "desc" },
  });

  return new Response(JSON.stringify(posts));
};

export { getPosts as GET };
