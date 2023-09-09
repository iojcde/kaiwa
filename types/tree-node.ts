import { TreeItem } from "react-complex-tree"

export interface TreeNode extends TreeItem<string> { 
  path: string
  urlPath: string
  content?: string
}
