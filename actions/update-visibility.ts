"use server"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { getServerSession } from "next-auth"

export const updateVisibility = async ({ room, isPublic }) => {
  const session = await getServerSession(authOptions)

  if (!session) throw new Error("Unauthorized")
  return await db.post.update({
    where: { id: room },
    data: { isPublic },
  })
}
