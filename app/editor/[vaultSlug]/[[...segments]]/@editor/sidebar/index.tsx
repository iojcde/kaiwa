import Tree from "./tree/tree"

import { parseGithubURL } from "@/lib/parseGithubURL"
import { SidebarMenu } from "./sidebar-menu"
import { useEditorContext } from "@/context/EditorContext"
import { buildTree } from "@/lib/tree/buildTree"
import { db } from "@/lib/db"
import { NewTree } from "./tree/new-tree"

export const Sidebar = async ({ vaultSlug }) => {
  // const [tree , id]= await getTree(vaultSlug)
  const vault = await db.vault.findUnique({
    where: { slug: vaultSlug },
    include: { files: { where: { latest: true } } },
  })

  const tree = buildTree(vault.files)

  return (
    <aside className="flex h-screen w-80 flex-col gap-4 bg-gray-1 p-4 pb-8">
      <div>
        <NewTree vaultSlug={vaultSlug} vaultId={vault.id} initialTree={tree} />
      </div>
    </aside>
  )
}
