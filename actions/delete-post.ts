"use server"
import { toast } from "@/components/ui/use-toast"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function deletePost(postId: string) {
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
