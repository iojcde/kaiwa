"use server"

import { createFile, db } from "@/lib/db"
import { generatePublicId } from "@/lib/utils"
import { TreeNode } from "@/types/tree-node"
import { revalidatePath } from "next/cache"

export const submit = async (formData: FormData) => {
  console.log("submit", formData)

  revalidatePath("/editor/[vaultSlug]")

  const vaultSlug = formData.get("vaultSlug").toString()

  if (formData.has("create-file")) {
    const existingFiles = await db.file.findMany({
      where: {
        path: { startsWith: `Untitled` },
        vault: { slug: vaultSlug },
        NOT: { path: { startsWith: `Untitled Folder` } },
      },
    })

    const name =
      existingFiles.length > 0 ? `Untitled ${existingFiles.length}` : "Untitled"
    const file = await createFile({
      public_id: generatePublicId(),
      path: `${name}.md`,
      filename: `${name}.md`,
      data: Buffer.from(""),
      vault: { connect: { slug: vaultSlug } },
      type: "FILE",
    })
    return {
      index: file.public_id,
      data: file.filename.replace(".md", ""),
      path: file.path,
      urlPath: file.path.replaceAll(" ", "+"),
      children: [],
      isFolder: false,
    } satisfies TreeNode
  } else if (formData.has("create-folder")) {
    const existingFolders = await db.file.findMany({
      where: {
        path: { startsWith: `Untitled Folder` },
        vault: { slug: vaultSlug },
      },
    })
    const name =
      existingFolders.length > 0
        ? `Untitled Folder ${existingFolders.length}`
        : "Untitled Folder"
    const file = await createFile({
      public_id: generatePublicId(),
      path: name,
      filename: name,
      data: Buffer.from(""),
      vault: { connect: { slug: vaultSlug } },
      type: "FOLDER",
    })

    return {
      index: file.public_id,
      data: file.filename,
      path: file.path,
      urlPath: file.path.replaceAll(" ", "+"),
      children: [],
      isFolder: true,
    } satisfies TreeNode
  }
}
