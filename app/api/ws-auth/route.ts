import { db } from "@/lib/db";

const wsAuth = async (req: Request) => {
  const auth = req.headers.get("auth");
  console.log("auth:", auth);
  if (auth !== process.env.WSAUTH_SECRET) {
    return new Response("Unauthorized", { status: 401 });
  }
  const { check, room } = await req.json();

  console.log({ check, room });

  const user = await db.user.findFirst({
    where: { wsToken: check },
    select: { id: true },
  });

  const post = await db.post.findFirst({
    where: { id: room },
    select: { access: { where: { userId: user.id } }, authorId: true },
  });
  console.log(post.authorId, user.id);
  if (post?.access.length > 0 || post?.authorId == user.id) {
    return new Response(
      JSON.stringify({
        level: post.authorId == user.id ? "OWNER" : post.access[0].level,
      }),
      { status: 200 }
    );
  } else {
    return new Response("Unauthorized", { status: 401 });
  }
};
export { wsAuth as POST };
