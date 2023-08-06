"use server"
import { verifyCurrentUserHasAccessToPost } from "@/lib/auth"
import { db } from "@/lib/db"

export const save = async ({
  id,
  title,
  content,
}: {
  id: string
  title?: string
  content?: string
}) => {
  console.log("saving post")
  if (!(await verifyCurrentUserHasAccessToPost(id))) {
    return { error: "You don't have permission to edit this post" }
  }

  return await db.post.update({ where: { id }, data: { title, content } })
}
