"use server"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib"
import { AccessLevel } from "@prisma/client"
import { getServerSession } from "next-auth"

export const updateAccessLevels = async (
  room: AccessLevel,
  updateList: Record<string, AccessLevel | "DELETE">
) => {
  const session = await getServerSession(authOptions)

  if (!session) throw new Error("Unauthorized")

  const post = await db.post.findFirst({
    where: { id: room },
    select: {
      access: { where: { userId: session?.user.id } },
      authorId: true,
    },
  })

  if (!post) {
    new Error("Post not found")
  }

  if (
    post?.authorId != session?.user.id ||
    post.access.find((a) => a.userId == session?.user.id)
  ) {
    new Error("Unauthorized")
  }

  Object.keys(updateList).forEach(async (id) => {
    if (updateList[id] === "DELETE") {
      await db.access.delete({
        where: { id },
      })
    } else {
      await db.access.update({
        where: { id },
        data: { level: updateList[id] as AccessLevel },
      })
    }
  })
}
