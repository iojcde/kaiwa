"use server"

import { authOptions } from "@/lib/auth"
import { createId } from "@paralleldrive/cuid2"
import * as Minio from "minio"
import { getServerSession } from "next-auth"

const minioClient = new Minio.Client({
  endPoint: "minio.jcde.xyz",
  accessKey: "GXLszOOIyaJGpfQNgFv1",
  secretKey: process.env.MINIO_SECRET as string,
  port: 443,
  useSSL: true,
})

export const getSignedURL = async () => {
  const session = await getServerSession(authOptions)

  if (!session) throw new Error("Unauthorized")

  const id = createId()

  const url = await minioClient.presignedPutObject(
    "kaiwa",
    `images/${id}`,
    60 * 60 * 24 * 7
  )
  return { url, id }
}
