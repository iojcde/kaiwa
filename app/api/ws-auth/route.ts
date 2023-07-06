import { db } from "@/lib/db";

const wsAuth = async (req: Request) => {
  const auth = req.headers.get("auth");
  const room = new URL(req.url).pathname.replace("/party/", "");

  console.log("auth:", auth);
  if (auth !== process.env.WSAUTH_SECRET) {
    return new Response("Unauthorized", { status: 401 });
  }
  const { check } = await req.json();

  const user = await db.user.findFirst({
    where: { wsToken: check },
    select: { id: true },
  });
  console.log(user);

  const post = await db.post.findFirst({
    where: { id: room },
    select: { access: { where: { userId: user.id } }, authorId: true },
  });

  if (post.access.length > 0 || post.authorId == user.id) {
    return new Response("OK", { status: 200 });
  } else {
    return new Response("Unauthorized", { status: 401 });
  }
};
export { wsAuth as POST };
