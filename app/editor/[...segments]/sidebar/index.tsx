import { FC, cache } from "react"
import { Tree, TreeNode } from "./sidebar-components"
import { App, Octokit } from "octokit"
import { components } from "@octokit/openapi-types" 

export type DirectoryItem = components["schemas"]["git-tree"]["tree"][number]

export const getChildren = async ({
  installationId,
  owner,
  repo,
  path,
}): Promise<DirectoryItem[]> => {
  const app = new App({
    appId: 371329,
    privateKey: process.env.GITHUB_PRIVATE_KEY.replace(/\\n/g, "\n"),
  })
  const octokit = await app.getInstallationOctokit(installationId)
  // const octokit = new Octokit()

  const { data } = await octokit.rest.repos.getContent({
    owner,
    repo,
    path,
    tree_sha: "main",
    request: {
      fetch: fetch,
    },
  })

  if (!Array.isArray(data)) return []
  return data
}
export const Sidebar: FC<{ segments: string[] }> = async ({ segments }) => {
  const workspace = segments[0]
  const baseDir = "data"

  const files = await getChildren({
    installationId: 40421197,
    owner: "iojcde",
    repo: "memx",
    path: baseDir,
  })

  const finalTree: TreeNode[] = [
    {
      id: "memx",
      urlPath: "/editor/iojcde-workspace",
      path: baseDir,
      title: "iojcde workspace",
      type: "Folder",
      children: files.map((file) => {
        return {
          id: file.sha,
          title: file.path,
          urlPath: `/editor/iojcde-workspace/${file.path.replace(baseDir + '/', "")}`,
          type: file.type == "dir" ? "Folder" : "Note",
          path: file.path,
          children:'/api/content',
        } satisfies TreeNode
      }),
    },
  ]

  return (
    <aside className="-ml-6 w-80">
      <div>
        <Tree tree={finalTree} level={0} />
      </div>
    </aside>
  )
}
