import { TreeNode } from "@/types/tree-node";

export const sortTree=(tree:TreeNode[])=>{
  //directories first
  return tree.sort((a,b)=>{
    if(a.type==="dir"&&b.type==="file") return -1;
    if(a.type==="file"&&b.type==="dir") return 1;
    return 0;
  })
}