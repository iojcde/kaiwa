"use server"

import { checkVaultAccess } from "@/lib/auth"
import { db } from "@/lib/db"
import { getServerSession } from "next-auth"

export const setTitle = async (
  vaultId: number,
  public_id: string,
  filename: string,
  oldPath: string
) => {
  checkVaultAccess(vaultId)
  
  await db.file.update({
    where: {
      vaultId_public_id_latest: {
        vaultId,
        public_id,
        latest: true,
      },
    },
    data: {
      filename,
      path: oldPath.replace(oldPath.split("/").pop() ?? "", filename),
    },
  })
}
