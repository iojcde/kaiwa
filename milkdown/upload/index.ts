import { getSignedURL } from "@/actions/get-signed-url"
import { upload, uploadConfig, Uploader } from "@milkdown/plugin-upload"
import type { Node } from "@milkdown/prose/model"
export const uploader: Uploader = async (files, schema) => {
  const images: File[] = []

  for (let i = 0; i < files.length; i++) {
    const file = files.item(i)
    if (!file) {
      continue
    }

    // You can handle whatever the file type you want, we handle image here.
    if (!file.type.includes("image")) {
      continue
    }

    images.push(file)
  }

  const nodes: Node[] = await Promise.all(
    images.map(async (image) => {
      const { id, url } = await getSignedURL()
      console.log(url)
      const res = await fetch(url, { method: "PUT", body: image })
      console.log("wow")
      console.log(await res.text())

      const alt = image.name
      return schema.nodes.image.createAndFill({
        src: `https://minio.jcde.xyz/kaiwa/images/${id}`,
        alt,
      }) as Node
    })
  )

  return nodes
}
