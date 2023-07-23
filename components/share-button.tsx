import { getServerSession } from "next-auth"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { ShareActions } from "./share-actions"

export const ShareButton = async ({ room }) => {
  const session = await getServerSession(authOptions)
  if (session == null) return <div></div>

  const {
    access,
    title,
    published,
    author: { knownUserIds },
  } = await db.post.findFirst({
    where: { id: room },
    select: {
      access: { include: { user: true } },
      title: true,
      published: true,
      author: { select: { knownUserIds: true } },
    },
  })

  const knownUsers = await db.user.findMany({
    where: { id: { in: knownUserIds } },
    select: { name: true, email: true, image: true },
  })

  return (
    <ShareActions
      published={published}
      room={room}
      title={title}
      session={session}
      access={access}
      knownUsers={knownUsers}
    />
  )
}
