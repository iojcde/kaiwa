import { db } from "@/lib/db"

const wsCallback = async (req: Request) => {
  const auth = req.headers.get("auth")

  if (auth !== process.env.WSAUTH_SECRET) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    })
  }
  const body = await req.json()

  console.log(body)

  return new Response("OK")
}
export { wsCallback as POST }
