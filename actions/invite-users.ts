"use server"

import { knownUser } from "@/components/share-actions"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { AccessLevel } from "@prisma/client"
import { getServerSession } from "next-auth"

export const inviteUsers = async ({
  invitedUsers,
  level,
  room,
}: {
  invitedUsers: knownUser[]
  level: AccessLevel
  room: string
}) => {
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
    return new Error("Post not found")
  }

  if (
    post?.authorId != session?.user.id &&
    post.access.find((a) => a.userId == session?.user.id).level != "EDITOR"
  )
    return new Error("Unauthorized")

  const foundUsers = await db.user.findMany({
    where: { email: { in: invitedUsers.map((u) => u.email) } },
    select: { email: true, id: true },
  })

  invitedUsers.forEach(async (user) => {
    const dbUser = foundUsers.find((u) => u.email == user.email)
    if (dbUser && dbUser.id != session.user.id) {
      return await db.access.create({
        data: {
          userId: dbUser.id,
          postId: room,
          level: level,
        },
      })
    } else {
      return await db.invite.upsert({
        where: {
          email: user.email,
        },
        update: {
          email: user.email,
          postId: room,
          invitedById: session.user.id,
          level,
        },
        create: {
          email: user.email,
          postId: room,
          invitedById: session.user.id,
          level,
        },
      })
    }
  })
}
