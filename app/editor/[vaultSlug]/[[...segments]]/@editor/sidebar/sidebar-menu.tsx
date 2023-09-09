import { FilePlusIcon, FolderPlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { submit } from "./handle-file-ops"
import { useRouter } from "next-nprogress-bar"
import { TreeNode } from "@/types/tree-node"
import { Dispatch, SetStateAction } from "react"

export const SidebarMenu = ({
  vaultSlug,
  setTree,
}: {
  vaultSlug: string
  setTree: Dispatch<SetStateAction<Record<string, TreeNode>>>
}) => {
  const handleSubmit = async (formData: FormData) => {
    formData.append("vaultSlug", vaultSlug)
    const data = await submit(formData)
    setTree((tree) => {
      if (formData.has("create-folder")) {
        return Object.assign(tree, {
          [data.index]: data,
          root: { children: [data.index, ...tree.root.children] },
        })
      } else {
        return Object.assign(tree, {
          [data.index]: data,
          root: { children: [...tree.root.children, data.index] },
        })
      }
    })
  }
  return (
    <form
      action={handleSubmit}
      className="flex w-full items-center justify-center"
    >
      <Button
        name="create-file"
        variant="ghost"
        className="flex h-7 w-7 items-center rounded-sm p-0"
      >
        <FilePlusIcon
          className="shrink text-gray-11 hover:text-gray-12"
          size={16}
        />
      </Button>
      <Button
        name="create-folder"
        variant="ghost"
        className="flex h-7 w-7 items-center rounded-sm p-0"
      >
        <FolderPlusIcon
          className="shrink text-gray-11 hover:text-gray-12"
          size={16}
        />
      </Button>
    </form>
  )
}
