import { onTreeChange } from "@/actions/on-tree-change"
import { renameFile } from "@/actions/rename-file"
import { buildTree } from "@/lib/tree/buildTree"
import { TreeNode } from "@/types/tree-node"
import {
  ExplicitDataSource,
  TreeDataProvider as TDP,
  Disposable,
  TreeItemIndex,
} from "react-complex-tree"
import { EventEmitter } from "react-complex-tree/lib/esm/EventEmitter"

export class TreeDataProvider implements TDP {
  private data: ExplicitDataSource
  private vaultId: number
  private refreshFn: () => void
  private pushFn: (path: string) => void

  private onDidChangeTreeDataEmitter = new EventEmitter<TreeItemIndex[]>()

  constructor(
    nodes: Record<string, TreeNode>,
    vaultId: number,
    refreshFn: () => void,
    pushFn: (path: string) => void
  ) {
    console.log("init tree data provider", Object.keys(nodes).length)
    this.data = { items: nodes }
    this.vaultId = vaultId
    this.refreshFn = refreshFn.bind(this)
    this.pushFn = pushFn.bind(this) 
  }

  private setItemName: (item: TreeNode, newName: string) => TreeNode = (
    item,
    newName
  ) => ({
    ...item,
    data: newName,
    urlPath: item.urlPath.replace(
      item.urlPath.split("/").pop(),
      newName + ".md"
    ),
    path: item.path.replace(item.path.split("/").pop(), newName + ".md"),
  })

  public async getTreeItem(id: string) {
    return this.data.items[id]
  }

  public async onChangeItemChildren(
    itemId: TreeItemIndex,
    newChildren: TreeItemIndex[]
  ): Promise<void> {
    this.data.items[itemId].children = newChildren
    this.onDidChangeTreeDataEmitter.emit([itemId])

    await onTreeChange(this.vaultId, itemId, newChildren)
  }

  public onDidChangeTreeData(
    listener: (changedItemIds: TreeItemIndex[]) => void
  ): Disposable {
    const handlerId = this.onDidChangeTreeDataEmitter.on((payload) =>
      listener(payload)
    )
    return { dispose: () => this.onDidChangeTreeDataEmitter.off(handlerId) }
  }

  public async onRenameItem(item: TreeNode, name: string): Promise<void> {
    if (this.setItemName) {
      await renameFile(
        this.vaultId,
        item.index.toString(),
        item.data,
        name,
        item.isFolder
      )
      let tmp = this.setItemName(item, name)
      this.data.items[item.index] = tmp
      // this.refreshFn()
      this.pushFn(tmp.urlPath)
      // this.onDidChangeTreeDataEmitter.emit(item.index);
    }
  }
}
