"use server"

import { checkVaultAccess } from "@/lib/auth"
import { db } from "@/lib/db"
import { TreeNode } from "@/types/tree-node"
import { TreeItemIndex } from "react-complex-tree"

export const onTreeChange = async (
  vaultId: number,
  itemId: TreeItemIndex,
  newChildren: TreeItemIndex[]
) => {
  checkVaultAccess(vaultId)
  const rootPath =
    itemId != "root"
      ? await db.file
          .findUnique({
            where: {
              vaultId_public_id_latest: {
                vaultId,
                public_id: itemId as string,
                latest: true,
              },
            },
          })
          .then((r) => r.path)
      : ""
  newChildren.forEach(async (ch) => {
    const old = await db.file.findUnique({
      where: {
        vaultId_public_id_latest: {
          vaultId,
          public_id: ch as string,
          latest: true,
        },
      },
    })

    const newPath = rootPath ? `${rootPath}/${old.filename}` : old.filename
    if (old.path == newPath) {
      return
    }

    await db.file.update({
      where: {
        vaultId_public_id_latest: {
          vaultId,
          public_id: ch as string,
          latest: true,
        },
      },
      data: {
        filename: old.filename,
        path: newPath,
        type: old.type,
        data: old.data,
      },
    })
  })
}
