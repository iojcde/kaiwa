import { ScrollArea } from "@/components/ui/scroll-area"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { Editor } from "./editor"
import { db } from "@/lib/db"
import { parseGithubURL } from "@/lib/parseGithubURL"
import { notFound } from "next/navigation"
import { buildTree } from "@/lib/tree/buildTree"
// const NoSSREditor = NextDynamic(() => import("@/app/editor/[room]/editor"), {
//   ssr: false,
//   loading: () => (
//     <div className="flex items-center justify-center mt-48">
//       <Loader2 className="animate-spin w-8 h-8 text-gray-9" />
//     </div>
//   ),
// });

const EditorPage = async ({
  params: { segments, vaultSlug },
}: {
  params: { segments: string[]; vaultSlug: string }
}) => {
  const session = await getServerSession(authOptions)
  const joinedPath = segments ? segments.join("/") : "/"
  const file = await db.file.findFirst({
    where: {
      path: decodeURIComponent(joinedPath).replaceAll("+", " "),
      latest: true,
      vault: { slug: vaultSlug },
    },
  })

  if (!file && joinedPath != "/") return notFound()

  return (
    <div className="mx-auto h-screen w-full max-w-4xl">
      <ScrollArea className="h-full w-full p-4">
        <Editor
          path={joinedPath}
          vaultSlug={vaultSlug}
          filename={file.filename}
          public_id={file.public_id}
          defaultContent={file.data.toString()}
        />
      </ScrollArea>
    </div>
  )
}
export default EditorPage

export const revalidate = 0
