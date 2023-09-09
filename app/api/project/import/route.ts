import { createFile, db } from "@/lib/db"
import { app } from "@/lib/octokit"

// recursively get all files in a git tree into an array

const ImportGit = async (req: Request) => {
  return

  const params = new URL(req.url).searchParams

  const owner = params.get("owner")
  const repo = params.get("repo")
  const branch = params.get("branch") ?? "master"
  const name = params.get("name")
  const slug = params.get("slug")
  const installationId = parseInt(params.get("installationId"))

  const octokit = await app.getInstallationOctokit(installationId)

  const getFile = async (path: string, level: number) => {
    console.log("getFile", path, level)
    const tree = await octokit.rest.git
      .getTree({
        owner,
        repo,
        tree_sha: path ? `${branch}:${path}` : branch,
      })
      .then((res) => res.data.tree)

    const files: (
      | { path: string; type: "tree" }
      | { path: string; type: "blob"; content: string }
    )[] = []

    await Promise.allSettled(
      tree.map(async (i) => {
        if (i.type == "blob") {
          const content = await octokit.rest.git
            .getBlob({
              owner,
              repo,
              file_sha: i.sha,
            })
            .then((res) => res.data.content)

          files.push({
            path: path ? `${path}/${i.path}` : i.path,
            type: "blob",
            content: Buffer.from(content, "base64").toString(),
          })
        } else if (i.type == "tree") {
          if (i.path.startsWith(".")) return
          const subFiles = await getFile(
            path ? `${path}/${i.path}` : i.path,
            level + 1
          )
          console.log("subFiles", subFiles.length)
          files.push({
            type: "tree",
            path: path ? `${path}/${i.path}` : i.path,
          })
          files.push(...subFiles)
        }
      })
    )

    return files
  }

  const files = await getFile("", 0)
 

  const ws = await db.vault.create({
    data: {
      slug,
      name,
      branch, 
    },
  })

  await db.file.createMany({
    data: {
     files
    },
  })

  return new Response("OK")
}

export { ImportGit as GET }
