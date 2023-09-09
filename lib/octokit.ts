import { App } from "octokit"

export const app = new App({
  appId: 371329,
  privateKey: process.env.GITHUB_PRIVATE_KEY.replace(/\\n/g, "\n"),
})
