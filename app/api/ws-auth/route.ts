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

  const post = await db.post.findFirst({
    where: { id: room },
    select: { access: { where: { userId: user.id } } },
  });

  if (post.access.length > 0) {
    return new Response("OK", { status: 200 });
  } else {
    return new Response("Unauthorized", { status: 401 });
  }
};
export { wsAuth as POST };
