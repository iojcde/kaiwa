import { ReactNode, cache } from "react"
import { EditorNav } from "./collab-nav"
import { CollabProvider } from "@/context/CollabContext"
import { ShareButton } from "@/components/share-button"
import { Sidebar } from "./sidebar"
import { App } from "octokit"

const EditorLayout: React.FC<{
  children: ReactNode
  params: { segments: string[] }
}> = async ({ children, params: { segments } }) => {

  // files.data.tree.map((file) => {
  //   return {
  //     id: file.sha,
  //     title: file.path,
  //     urlPath: file.path,
  //     type: file.type == "tree" ? "Folder" : "Note",
  //     segment: file.path,
  //     children: [],
  //   } satisfies TreeNode
  // })

  return (
    <div className="flex"> 
        <div
          style={{ height: `calc(100vh - 64px)` }}
          className=" sticky top-16 hidden shrink-0 border-r border-neutral-200 dark:border-neutral-800 sm:block"
        >
          <div className=" -ml-3 h-full overflow-y-scroll p-8 pl-16">
            <Sidebar segments={segments} />
          </div>
        </div>
        {/* <EditorNav shareButton={<ShareButton room={room} />} /> */}
        {children} 
    </div>
  )
}
export default EditorLayout
