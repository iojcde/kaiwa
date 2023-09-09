"use server"

import { checkVaultAccess } from "@/lib/auth"
import { db } from "@/lib/db"
import { startsWith } from "lodash"

export const renameFile = async (
  vaultId: number,
  public_id: string,
  oldPath: string,
  newFilename: string,
  isFolder: boolean
) => {
  
  checkVaultAccess(vaultId)
  const newFile = await db.file.update({
    where: {
      vaultId_public_id_latest: {
        vaultId,
        public_id,
        latest: true,
      },
    },
    data: {
      path: oldPath.replace(
        oldPath.split("/").pop(),
        newFilename + (!isFolder ? ".md" : "")
      ),
      filename: newFilename,
    },
  })

  if (isFolder) {
    const res = await db.file.findMany({
      where: {
        path: { startsWith: newFile.path },
        NOT: {
          id: newFile.id,
        },
      },
    })
    console.log(res)

    res.forEach(async (i) => {
      return await db.file.update({
        where: {
          id: i.id,
        },
        data: {
          path: i.path.replace(oldPath, newFile.path),
        },
      })
    })
  }
}
