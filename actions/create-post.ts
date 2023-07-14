"use server"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { randomRoomName } from "@/lib/randomRoomName"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"

export const createPost = async () => {
  const session = await getServerSession(authOptions)

  if (session?.user.id === undefined) throw new Error("No user id")

  const post = await db.post.create({
    data: {
      id: randomRoomName(),
      title: "Untitled Post",
      content: "",
      authorId: session?.user.id,
    },
  })
  return post
}
