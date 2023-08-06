import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { getServerSession } from "next-auth"
import NextDynamic from "next/dynamic"
import React from "react"
import { Octokit } from "octokit"
import { Sidebar, TreeNode } from "./sidebar"
import { Node } from "@prisma/client"
// const NoSSREditor = NextDynamic(() => import("@/app/editor/[room]/editor"), {
//   ssr: false,
//   loading: () => (
//     <div className="flex items-center justify-center mt-48">
//       <Loader2 className="animate-spin w-8 h-8 text-gray-9" />
//     </div>
//   ),
// });

const EditorPage = async ({
  params: { segments },
}: {
  params: { segments: string[] }
}) => {
  const workspaceSegment = segments[0]

  const session = await getServerSession(authOptions)

  return (
    <div className="w-full max-w-4xl flex-col p-4 items-start justify-center ">
      <div>Hello</div>
    </div>
  )
}
export default EditorPage

export const revalidate = 0
