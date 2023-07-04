import { db } from "@/lib/db";

const wsAuth = async (req: Request) => {
  const auth = req.headers.get("auth");
  console.log("auth:", auth);
  if (auth !== process.env.WSAUTH_SECRET) {
    return new Response("Unauthorized", { status: 401 });
  }
  const { check, userID } = await req.json();

  const user = await db.user.findFirst({ where: { id: userID } });

  console.log("session", user.wsToken);

  console.log("check:", check);

  if (user.wsToken == check) {
    return new Response("OK", { status: 200 });
  } else {
    return new Response("Unauthorized", { status: 401 });
  }
};
export { wsAuth as POST };
