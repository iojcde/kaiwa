import { app } from "@/lib/octokit"

const getContent = async (req: Request) => {
  const octokit = await app.getInstallationOctokit(40421197)

  const { owner, repo, path } = await req.json()

  const res = await octokit.rest.repos.getContent({
    owner,
    repo,
    path,
  })

  return new Response(Buffer.from(res.data.content, "base64").toString())
}
export { getContent as POST }
