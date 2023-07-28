import { commandsCtx, editorViewCtx } from "@milkdown/core"
import { Ctx, MilkdownPlugin } from "@milkdown/ctx"
import { slashFactory } from "@milkdown/plugin-slash"
import {
  createCodeBlockCommand,
  insertHrCommand,
  wrapInHeadingCommand,
} from "@milkdown/preset-commonmark"
import { Braces, Heading1, Heading2, Heading3, LucideIcon, Minus } from "lucide-react"
import { ReactNode } from "react"

type ConfigItem = {
  onSelect: (ctx: Ctx) => void
  icon: LucideIcon
  title: string
  description: string
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

    icon: Heading1,
    title: "Heading 1",
    description: "Large heading",
  },
  {
    onSelect: (ctx: Ctx) =>
      ctx.get(commandsCtx).call(wrapInHeadingCommand.key, 2),
    icon: Heading2,
    title: "Heading 2",
    description: "Medium heading",
  },
  {
    onSelect: (ctx: Ctx) =>
      ctx.get(commandsCtx).call(wrapInHeadingCommand.key, 3),
    icon: Heading3,
    title: "Heading 3",
    description: "Small heading",
  },
  {
    onSelect: (ctx: Ctx) =>
      ctx.get(commandsCtx).call(createCodeBlockCommand.key),
    icon: Braces,
    title: "Code Block",
    description: "Inserts a code block",
  },
  {
    onSelect: (ctx: Ctx) => ctx.get(commandsCtx).call(insertHrCommand.key),
    icon: Minus,
    title: "Divider",
    description: "Inserts a divider",
  },
].map((item) => ({
  ...item,
  onSelect: (ctx: Ctx) => {
    removeSlash(ctx)
    item.onSelect(ctx)
  },
}))
