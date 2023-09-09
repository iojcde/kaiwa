import { db } from "@/lib"

const wsCallback = async (req: Request) => {
  // const auth = req.headers.get("auth")

  // if (auth !== process.env.WSAUTH_SECRET) {
  //   return new Response(JSON.stringify({ error: "Unauthorized" }), {
  //     status: 401,
  //   })
  // }

  const { data, room } = await req.json()
  try {
    await db.post.update({
      where: {
        id: room,
      },
      data: {
        content: JSON.stringify(data),
      },
    })
  } catch (e) {
    console.error(e)
    return new Response(JSON.stringify({ error: e.message }), { status: 500 })
  }
  return new Response("OK")
}
export { wsCallback as POST }
