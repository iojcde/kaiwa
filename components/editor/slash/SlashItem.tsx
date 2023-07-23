import { Ctx } from "@milkdown/ctx"
import { Instance } from "@milkdown/react"
import { clsx } from "clsx"
import { FC, ReactNode } from "react"

type SlashItemProps = {
  index: number
  instance: Instance
  onSelect: (ctx: Ctx) => void
  children: ReactNode
  selected: boolean
  setSelected: (selected: number) => void
}

export const SlashItem: FC<SlashItemProps> = ({
  index,
  instance,
  onSelect,
  children,
  selected,
  setSelected,
}) => {
  const [loading, getEditor] = instance

  const onPick = () => {
    if (loading) return

    getEditor().action((ctx) => {
      onSelect(ctx)
    })
  }

  return (
    <li
      className={clsx(
        "cursor-pointer px-6 py-3 transition duration-100",
        selected && "bg-gray-2"
      )}
      onMouseMove={() => setSelected(index)}
      onMouseDown={(e) => {
        e.preventDefault()
        onPick()
      }}
    >
      {children}
    </li>
  )
}
