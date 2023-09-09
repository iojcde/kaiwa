import { db } from "@/lib"
import { WorkspaceCard } from "./workspace-card"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export const Workspaces = async () => {
  const session = await getServerSession(authOptions)

  const workspaces = await db.workspace.findMany({
    where: { users: { some: { id: session.user.id } } },
  })

  return (
    <div className="mt-8 divide-y divide-border overflow-clip rounded-lg border ">
      {workspaces.length > 0 ? (
        workspaces.map((workspace) => (
          <WorkspaceCard key={workspace.id} workspace={workspace} />
        ))
      ) : (
        <div className="rounded-lg bg-gray-2 p-8 text-gray-11 shadow-inner">
          No posts yet...
        </div>
      )}
    </div>
  )
}
