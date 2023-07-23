import { commandsCtx, editorViewCtx } from "@milkdown/core"
import { Ctx, MilkdownPlugin } from "@milkdown/ctx"
import { slashFactory } from "@milkdown/plugin-slash"
import {
  createCodeBlockCommand,
  insertHrCommand,
  wrapInHeadingCommand,
} from "@milkdown/preset-commonmark"
import { Braces, Heading1, Heading2, Heading3, Minus } from "lucide-react"
import { ReactNode } from "react"

type ConfigItem = {
  renderer: ReactNode
  onSelect: (ctx: Ctx) => void
}

const removeSlash = (ctx: Ctx) => {
  // remove slash
  const view = ctx.get(editorViewCtx)
  view.dispatch(
    view.state.tr.delete(
      view.state.selection.from - 1,
      view.state.selection.from
    )
  )
}

export const slash = slashFactory("slashMenu") satisfies MilkdownPlugin[]

export const config: Array<ConfigItem> = [
  {
    onSelect: (ctx: Ctx) =>
      ctx.get(commandsCtx).call(wrapInHeadingCommand.key, 1),
    renderer: (
      <div className="flex items-center gap-2">
        <Heading1 />
        Large Heading
      </div>
    ),
  },
  {
    onSelect: (ctx: Ctx) =>
      ctx.get(commandsCtx).call(wrapInHeadingCommand.key, 2),
    renderer: (
      <div className="flex items-center gap-2">
        <Heading2 />
        Medium Heading
      </div>
    ),
  },
  {
    onSelect: (ctx: Ctx) =>
      ctx.get(commandsCtx).call(wrapInHeadingCommand.key, 3),
    renderer: (
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-nord-10 dark:text-nord-9">
          <Heading3 />
        </span>
        Small Heading
      </div>
    ),
  },
  {
    onSelect: (ctx: Ctx) =>
      ctx.get(commandsCtx).call(createCodeBlockCommand.key),
    renderer: (
      <div className="flex items-center gap-2">
        <Braces />
        Code Block
      </div>
    ),
  },
  {
    onSelect: (ctx: Ctx) => ctx.get(commandsCtx).call(insertHrCommand.key),
    renderer: (
      <div className="flex items-center gap-2">
        <Minus />
        Divider
      </div>
    ),
  },
].map((item) => ({
  ...item,
  onSelect: (ctx: Ctx) => {
    removeSlash(ctx)
    item.onSelect(ctx)
  },
}))
