"use server"
import { checkVaultAccess } from "@/lib/auth"
import { db } from "@/lib/db"

export const setFileData = async (
  vaultId: number,
  public_id: string,
  data: string
) => {
  
  checkVaultAccess(vaultId)
  
  const old = await db.file.findUnique({
    where: {
      vaultId_public_id_latest: { vaultId, public_id, latest: true },
    },
  })

  // within 5 minutes, don't create a new version
  if (old.updatedAt.getTime() > Date.now() - 5 * 60 * 1000) {
    await db.file.update({
      where: {
        vaultId_public_id_latest: { vaultId, public_id, latest: true },
      },
      data: {
        data: Buffer.from(data),
      },
    })
  } else {
    await db.file.update({
      where: {
        vaultId_public_id_latest: { vaultId, public_id, latest: true },
      },
      data: {
        latest: false,
      },
    })

    await db.file.create({
      data: {
        public_id,
        path: old.path,
        vaultId: old.vaultId,
        filename: old.filename,
        data: Buffer.from(data),
        type: old.type,
      },
    })
  }
}
