import { PrismaClient } from "@prisma/client"

declare global {
  // eslint-disable-next-line no-var
  var cachedPrisma: PrismaClient | undefined
}

export const db: PrismaClient = global.cachedPrisma || new PrismaClient()

if (process.env.NODE_ENV !== "production") {
  global.cachedPrisma = db
}

export { getFile, createFile, deleteFile, updateFile } from "./files"
