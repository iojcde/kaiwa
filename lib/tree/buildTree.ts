import { File } from "@prisma/client"
import { TreeNode } from "@/types/tree-node"
import { TreeItem } from "react-complex-tree"

export const buildTree = (nodes: File[]): Record<string, TreeNode> => {
  // recursively build a tree from a flat list
  const res: Record<string, TreeNode> = {
    root: {
      index: "root",
      canMove: false,
      isFolder: true,
      children: [],
      path: "",
      urlPath: "",
      data: "root",
    },
  }

  const findChildren = (path: string) => {
    const tmp = []
    const children = nodes.filter(
      (i) => i.path.split("/").slice(0, -1).join("/") == path
    )

    const folders = children.filter((i) => i.type == "FOLDER")
    folders.forEach((i) => {
      let node: TreeNode = {
        index: i.public_id,
        data: i.filename,
        path: i.path,
        urlPath: i.path.replaceAll(" ", "+"),
        children: findChildren(i.path),
        isFolder: true,
      }
      res[i.public_id] = node

      tmp.push(i.public_id)

      nodes.splice(nodes.indexOf(i), 1)
    })

    const files = children.filter((i) => i.type == "FILE")
    files.forEach((i) => {
      const node: TreeNode = {
        data: i.path.split("/").pop().replaceAll(".md", "") as string,
        index: i.public_id,
        path: i.path,
        urlPath: i.path.replaceAll(" ", "+"),
      }
      res[i.public_id] = node

      tmp.push(i.public_id)

      nodes.splice(nodes.indexOf(i), 1)
    })

    return tmp
  }

  res.root.children = findChildren("")

  return res
}
