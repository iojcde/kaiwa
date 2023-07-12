import { db } from "@/lib/db";

const wsAuth = async (req: Request) => {
  const auth = req.headers.get("auth");

  if (auth !== process.env.WSAUTH_SECRET) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }
  const { check, room } = await req.json();

  const user = await db.user.findFirst({
    where: { wsToken: check },
    select: { id: true },
  });

  if (user) {
    const post = await db.post.findFirst({
      where: { id: room },
      select: { access: { where: { userId: user.id } }, authorId: true },
    });

    if (post?.access.length > 0 || post?.authorId == user.id) {
      return new Response(
        JSON.stringify({
          level: post.authorId == user.id ? "OWNER" : post.access[0].level,
        }),
        { status: 200 }
      );
    } else {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }
  } else {
    const post = await db.post.findFirst({
      where: { id: room },
      select: { published: true },
    });

    return post.published
      ? new Response(JSON.stringify({ level: "VIEWER" }))
      : new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
        });
  }
};
export { wsAuth as POST };
