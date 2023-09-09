export const parseGithubURL = (url: string): [string, string] => {
  const urlParts = url.split("/")
  const repoName = urlParts[urlParts.length - 1]
  const repoOwner = urlParts[urlParts.length - 2]
  return [repoOwner, repoName]
}
