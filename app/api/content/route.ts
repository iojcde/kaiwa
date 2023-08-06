import { getChildren } from "@/app/editor/[...segments]/sidebar"
import { TreeNode } from "@/app/editor/[...segments]/sidebar/sidebar-components"

const getContent = async (req: Request) => {
  const props = await req.json()

  const files = await getChildren(props)
  return files.map(
    (file) =>
      ({
        id: file.sha,
        title: file.path,
        urlPath: `/editor/iojcde-workspace/${file.path.replace("data/", "")}`,
        type: file.type == "dir" ? "Folder" : "Note",
        path: file.path,
        children: [],
      }) satisfies TreeNode
  )
}

export { getContent as GET}