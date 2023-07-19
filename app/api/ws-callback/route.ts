import { db } from "@/lib/db"

const wsCallback = async (req: Request) => {
  const auth = req.headers.get("auth")

  if (auth !== process.env.WSAUTH_SECRET) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    })
  }
  console.log(req)
}
export { wsCallback as POST }
