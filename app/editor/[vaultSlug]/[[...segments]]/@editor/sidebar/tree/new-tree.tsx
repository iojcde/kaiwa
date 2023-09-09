"use client"

import "react-complex-tree/lib/style-modern.css"
import {
  ControlledTreeEnvironment,
  DraggingPositionItem,
  Tree,
} from "react-complex-tree"
import { usePathname } from "next/navigation"
import { useRouter } from "next-nprogress-bar"
import { TreeNode } from "@/types/tree-node"
import { useEditorContext } from "@/context/EditorContext"
import { useCallback, useState } from "react"
import { SidebarMenu } from "../sidebar-menu"
import { onTreeChange } from "@/actions/on-tree-change"
import { renameFile } from "@/actions/rename-file"

export const NewTree = ({
  vaultSlug,
  initialTree,
  vaultId,
}: {
  vaultSlug: string
  initialTree: Record<string, TreeNode>
  vaultId: number
}) => {
  const [tree, setTree] = useState(initialTree)

  const currentPath = decodeURIComponent(usePathname()) 
  const [focusedItem, setFocusedItem] = useState(
    Object.values(initialTree).find((i) => {
      return i.urlPath == currentPath.replace(`/editor/${vaultSlug}/`, "")
    })?.index
  )
  const [selectedItems, setSelectedItems] = useState([])
  const [expandedItems, setExpandedItems] = useState([])

  const router = useRouter()

  return (
    <ControlledTreeEnvironment
      items={tree}
      getItemTitle={(item) => item.data}
      canDragAndDrop={true}
      onPrimaryAction={(item: TreeNode) =>
        !item.isFolder && router.push(`/editor/${vaultSlug}/${item.urlPath}`)
      }
      canDropOnFolder={true}
      onDrop={(items, target) => {
        if (target.targetType == "item") {
          const targetId = target.targetItem as string
          const itemIds = items
            .filter((i) => !tree[targetId].children.includes(i.index))
            .map((i) => {
              return i.index
            })

          if (itemIds.length == 0) return

          onTreeChange(vaultId, targetId, itemIds)
          setTree((tree) => ({
            ...tree,
            [targetId]: {
              ...tree[targetId],
              children: [...tree[targetId].children, ...itemIds],
            },
            [target.parentItem]: {
              ...tree[target.parentItem],
              children: tree[target.parentItem].children.filter(
                (i) => !itemIds.includes(i)
              ),
            },
          }))
        }
      }}
      viewState={{
        ["tree-1"]: {
          focusedItem,
          expandedItems,
          selectedItems,
        },
      }}
      onRenameItem={async (item: TreeNode, newName) => {
        await renameFile(
          vaultId,
          item.index.toString(),
          item.data,
          newName,
          item.isFolder
        )
        let tmp = {
          ...item,
          data: newName,
          urlPath: item.urlPath.replace(
            item.urlPath.split("/").pop(),
            newName + ".md"
          ),
          path: item.path.replace(item.path.split("/").pop(), newName + ".md"),
        }
        setTree((tree) => ({
          ...tree,
          [item.index]: tmp,
        }))
        router.push(tmp.urlPath)
      }}
      onFocusItem={(item) => setFocusedItem(item.index)}
      onExpandItem={(item) => setExpandedItems([...expandedItems, item.index])}
      onCollapseItem={(item) =>
        setExpandedItems(
          expandedItems.filter(
            (expandedItemIndex) => expandedItemIndex !== item.index
          )
        )
      }
      onSelectItems={(items) => setSelectedItems(items)}
    >
      <SidebarMenu vaultSlug={vaultSlug} setTree={setTree} />
      <div className="my-2 pl-3 text-sm font-semibold">
        Jeeho Ahn&apos;s workspace
      </div>
      <Tree treeId="tree-1" rootItem="root" treeLabel="Tree Example" />
    </ControlledTreeEnvironment>
  )
}
