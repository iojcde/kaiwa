import { ReactNode, cache } from "react"
import { CollabProvider } from "@/context/CollabContext"
import { App } from "octokit"
import Link from "next/link"
import { Nav } from "@/components/nav"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sidebar } from "./[[...segments]]/@editor/sidebar"
import EditorContext, { EditorContextProvider } from "@/context/EditorContext"
import { db } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { buildTree } from "@/lib/tree/buildTree"

const EditorLayout: React.FC<{
  children: ReactNode
  intro: ReactNode
  params: { segments: string[]; vaultSlug: string }
}> = async ({ children, params: { vaultSlug } }) => {
  const session = await getServerSession(authOptions)
  if (!session) throw new Error("Unauthorized")

  const vault = await db.vault.findUnique({
    where: {
      users: {
        some: {
          id: {
            equals: session.user.id,
          },
        },
      },
      slug: vaultSlug,
    },
    include: { files: { where: { latest: true } } },
  })

  const tree = buildTree(vault.files)

  if (!vault) throw new Error("Vault not found")

  return (
    <div className="flex h-screen">
      <EditorContextProvider
        vaultId={vault.id}
        initialTree={tree}
        slug={vaultSlug}
      >
        <div className="sticky top-16 hidden h-screen shrink-0 border-r border-neutral-200 dark:border-neutral-800 sm:block">
          <ScrollArea className="h-full">
            <Sidebar />
          </ScrollArea>
        </div>
        {children}
      </EditorContextProvider>
    </div>
  )
}
export default EditorLayout
