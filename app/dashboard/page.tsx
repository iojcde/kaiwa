import { Button } from "@/components/ui/button"
import { db } from "@/lib/db"
import { Loader2, PlusIcon } from "lucide-react"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { WorkspaceCard } from "./workspace-card"
import { authOptions } from "@/lib/auth"
import { Workspaces } from "./workspaces"
import { Suspense } from "react"
import { randomRoomName } from "@/lib/randomRoomName"
import { revalidatePath } from "next/cache"
import { PostCreateButton } from "@/components/post-create-button"

const Dashboard = async () => {
  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-4xl font-bold tracking-tight">Your Notes</h1>
        <PostCreateButton />
      </div>

      <Suspense
        fallback={
          <div className="divide-border-200 mt-8 divide-y rounded-md border">
            <WorkspaceCard.Skeleton />
            <WorkspaceCard.Skeleton />
            <WorkspaceCard.Skeleton />
            <WorkspaceCard.Skeleton />
            <WorkspaceCard.Skeleton />
          </div>
        }
      >
        <Workspaces />
      </Suspense>
    </div>
  )
}

export default Dashboard

export const metadata = {
  title: "Dashboard",
}

export const revalidate = 0
