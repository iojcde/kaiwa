import { db } from "."
import { Prisma } from "@prisma/client"

export const getFile = async (public_id: string) => {
  return await db.file.findFirst({
    where: { public_id: public_id, latest: true },
    orderBy: { createdAt: "desc" },
  })
}

export const createFile = async (data: Prisma.FileCreateInput) => {
  return await db.file.create({ data })
}

export const deleteFile = async (public_id: string) => {
  return await db.file.updateMany({
    where: { public_id },
    data: { deleted: true },
  })
}

export const updateFile = async (
  public_id: string,
  data: Prisma.FileCreateInput
) => {
  await db.file.updateMany({
    where: { public_id },
    data: { latest: false },
  })

  return await db.file.create({ data })
}

export const getVaultFiles = async (vaultId: number) => {
  return await db.file.findMany({
    where: { vaultId, latest: true, deleted: false },
    orderBy: { createdAt: "desc" },
  })
}
