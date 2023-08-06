import { PrismaClient } from "@prisma/client"
import { withBark } from "prisma-extension-bark"

const getExtendedPrismaClient = () => {
  return new PrismaClient().$extends(withBark({ modelNames: ["node"] }))
}

export type ExtendedPrismaClient = ReturnType<typeof getExtendedPrismaClient>

declare global {
  // eslint-disable-next-line no-var
  var cachedPrisma: ExtendedPrismaClient | undefined
}

export const db: ExtendedPrismaClient =
  global.cachedPrisma || getExtendedPrismaClient()

if (process.env.NODE_ENV !== "production") {
  global.cachedPrisma = db
}
