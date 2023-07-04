import { db } from "@/lib/db";

const wsAuth = async (req: Request) => {
  console.log("wow");
  const auth = req.headers.get("auth");

  if (auth !== process.env.WSAUTH_SECRET) {
    return new Response("Unauthorized", { status: 401 });
  }
  const { check, userID } = await req.json<{ check: string; userID: string }>();

  const session = await db.session.findFirst({ where: { userId: userID } });

  if (session.wsToken == check) {
    return new Response("OK", { status: 200 });
  } else {
    return new Response("Unauthorized", { status: 401 });
  }
};
export { wsAuth as POST };
