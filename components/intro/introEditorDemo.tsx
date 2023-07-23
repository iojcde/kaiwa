"use client"

import { Editor, defaultValueCtx, editorViewCtx, rootCtx } from "@milkdown/core"
import { Milkdown, MilkdownProvider, useEditor } from "@milkdown/react"

import { proseSizeCtx, theme } from "@/milkdown/theme"
import { clipboard } from "@milkdown/plugin-clipboard"
import { history } from "@milkdown/plugin-history"
import { commonmark } from "@milkdown/preset-commonmark"
import { gfm } from "@milkdown/preset-gfm"

import { placeholder } from "@/milkdown/plugins/placeholder"
import { introContent } from "./intro-content"
import { useSlash } from "../editor/slash"
import { ProsemirrorAdapterProvider } from "@prosemirror-adapter/react"

const MilkdownEditor = () => {
  const slash = useSlash()

  const { get } = useEditor((root) =>
    Editor.make()
      .config((ctx) => ctx.set(rootCtx, root as Node))
      .config((ctx) => ctx.set(defaultValueCtx, introContent))
      .config((ctx) => slash.config(ctx))
      .config(theme)
      .config((ctx) => ctx.set(proseSizeCtx, "sm"))
      .use(commonmark)
      .use(gfm)
      .use(clipboard)
      .use(placeholder)
      .use(history)
      .use(slash.plugins)
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

  return (
    <div className="p-6">
      <Milkdown />
    </div>
  )
}

export const IntroEditorDemo = () => (
  <MilkdownProvider>
    <ProsemirrorAdapterProvider>
      <MilkdownEditor />
    </ProsemirrorAdapterProvider>
  </MilkdownProvider>
)
