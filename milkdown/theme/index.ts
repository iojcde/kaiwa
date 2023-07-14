/* Copyright 2021, Milkdown by Mirone. */
import { createSlice, type Ctx } from "@milkdown/ctx"
import { editorViewOptionsCtx } from "@milkdown/core"
import clsx from "clsx"

import "@milkdown/prose/view/style/prosemirror.css"
import "@milkdown/prose/tables/style/tables.css"
import "./style.css"

export const proseSizeCtx = createSlice<"base" | "sm">("base", "proseSize")

export const theme = (ctx: Ctx): void => {
  ctx.inject(proseSizeCtx)

  ctx.update(editorViewOptionsCtx, (prev) => {
    const prevClass = prev.attributes

    return {
      ...prev,
      editable: () => true,
      attributes: (state) => {
        const attrs =
          typeof prevClass === "function" ? prevClass(state) : prevClass

        return {
          ...attrs,
          class: clsx(
            `prose ${
              ctx.get(proseSizeCtx) == "sm" ? "prose-base" : `lg:prose-lg`
            } prose-gray -mx-2 h-full px-2 pb-80 outline-none dark:prose-invert`,
            attrs?.class || "",
            "milkdown-theme-iojcde"
          ),
        }
      },
    }
  })
}
