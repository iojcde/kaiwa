import { db } from "@/lib/db"
import { WorkspaceCard } from "./vault-card"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export const Vaults = async () => {
  const session = await getServerSession(authOptions)

  const vaults = await db.vault.findMany({
    where: { users: { some: { id: session.user.id } } },
    select: {
      id: true,
      slug: true,
      _count: {
        select: {
          files: {
            where: {
              deleted: false,
              latest: true,
              type: "FILE",
            },
          },
        },
      },
      name: true,
    },
  })

  return (
    <div className="mt-8 divide-y divide-border overflow-clip rounded-lg border ">
      {vaults.length > 0 ? (
        vaults.map((vault) => <WorkspaceCard key={vault.id} vault={vault} />)
      ) : (
        <div className="rounded-lg bg-gray-2 p-8 text-gray-11 shadow-inner">
          No posts yet...
        </div>
      )}
    </div>
  )
}
