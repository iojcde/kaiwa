"use server"
import { toast } from "@/components/ui/use-toast"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { getServerSession } from "next-auth"
import { revalidatePath } from "next/cache"

export async function deletePost(postId: string) {
  const session = await getServerSession(authOptions)

  if (!session) throw new Error("Unauthorized")

  try {
    await db.post.delete({ where: { id: postId } })
  } catch (e) {
    toast({
      title: "Something went wrong.",
      description: "Your post was not deleted. Please try again.",
      variant: "destructive",
    })
  }
  revalidatePath("/dashboard")
  return true
}
