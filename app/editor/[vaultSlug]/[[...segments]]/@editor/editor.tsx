"use client"

import {
  Editor as EditorPrimative,
  defaultValueCtx,
  editorViewCtx,
  remarkCtx,
  rootCtx,
} from "@milkdown/core"
import { Milkdown, MilkdownProvider, useEditor } from "@milkdown/react"
import { debounce } from "lodash"
import { proseSizeCtx, theme } from "@/milkdown/theme"
import { clipboard } from "@milkdown/plugin-clipboard"
import { history } from "@milkdown/plugin-history"
import { commonmark } from "@milkdown/preset-commonmark"
import { gfm } from "@milkdown/preset-gfm"

import { placeholder } from "@/milkdown/plugins/placeholder"
import { ProsemirrorAdapterProvider } from "@prosemirror-adapter/react"
import { useSlash } from "@/components/editor/slash"
import { listener, listenerCtx } from "@milkdown/plugin-listener"
import React, { use, useCallback, useEffect } from "react"
import { parseFrontmattter } from "@/lib/parseFrontmatter"
import { Textarea } from "@/components/ui/textarea"
import { setTitle } from "@/actions/set-title"
import { usePathname, useRouter } from "next/navigation"
import { setFileData } from "@/actions/set-file-data"

const MilkdownEditor = ({ public_id, filename, path, defaultContent }) => {
  const slash = useSlash()
  const router = useRouter()
  const currentPath = usePathname()
  const uploadData = debounce(async (markdown) => {
    await setFileData(1, public_id, markdown)
    console.log("saved")
  }, 2000)

  const { get } = useEditor((root) =>
    EditorPrimative.make()
      .config((ctx) => ctx.set(rootCtx, root as Node))
      .config((ctx) => ctx.set(defaultValueCtx, defaultContent))
      .config((ctx) => slash.config(ctx))
      .config(theme)
      .use(commonmark)
      .use(gfm)
      .use(clipboard)
      .use(placeholder)
      .use(history)
      .use(slash.plugins)
      .use(listener)
      .config((ctx) => {
        const listener = ctx.get(listenerCtx)

        listener.markdownUpdated(async (ctx, markdown, prevMarkdown) => {
          if (markdown == prevMarkdown) return

          await uploadData(markdown)
        })
      })
  )

  get()?.action((ctx) => {
    const view = ctx.get(editorViewCtx)
    queueMicrotask(() =>
      view.setProps({
        attributes: Object.assign(
          typeof view.props.attributes == "function"
            ? view.props.attributes(view.props.state)
            : view.props.attributes,
          {
            spellcheck: "false",
          }
        ),
      })
    )
  })

  const handleTitleInput = async (e) => {
    if (e.key == "Enter") {
      e.preventDefault()
      get()?.action((ctx) => {
        const view = ctx.get(editorViewCtx)
        queueMicrotask(() => view.focus())
      })

      await setTitle(1, public_id, e.target.value + ".md", path)
      console.log(e.target.value)

      router.refresh()
      return router.push(
        currentPath.replace(filename, e.target.value.replace(" ", "+"))
      )
    }
  }

  return (
    <div className="p-6">
      <input
        className="w-full text-4xl font-extrabold outline-none"
        type="text"
        defaultValue={filename.split(".").slice(0, -1)[0]}
        onKeyDown={handleTitleInput}
      />
      <Milkdown />
    </div>
  )
}

export const Editor = (props) => {
  return (
    <MilkdownProvider>
      <ProsemirrorAdapterProvider>
        <MilkdownEditor {...props} />
      </ProsemirrorAdapterProvider>
    </MilkdownProvider>
  )
}
