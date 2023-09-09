"use client"

import { sortTree } from "@/lib/tree/sortTree"
import { Node } from "./tree-components"
import { cn } from "@/lib/utils"
import { Suspense, cache, use } from "react"
import { TreeNode } from "@/types/tree-node"

const Tree: React.FC<{ tree?: TreeNode[]; level: number; path?: string }> = ({
  tree,
  level,
  path,
}) => {
  // const newtree = use(
  //   tree && tree.length > 0 ? Promise.resolve(tree) : getChildren(path)
  // )
  if (!tree) return null
  return (
    <div
      className={cn(
        ` flex flex-col space-y-1`,
        level > 0
          ? `relative z-30 ml-[16px] border-l border-neutral-200 pl-3 dark:border-neutral-800`
          : ``
      )}
    >
      {tree.map((treeNode, index) => (
        <Node key={index} node={treeNode} level={level} />
      ))}
    </div>
  )
}
export default Tree
