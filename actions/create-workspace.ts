"use server"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib"
import { randomRoomName } from "@/lib/randomRoomName"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"

export const createWorkspace = async ({ name: string, slug }) => {
  const session = await getServerSession(authOptions)

  if (!session) throw new Error("Unauthorized")

  const post = await db.workspace.create({
    data: {
      id: randomRoomName(),
      title: "Untitled Post",
      content: "",
      authorId: session?.user.id,
    },
  })
  return post
}
