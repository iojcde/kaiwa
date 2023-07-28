import { MouseEventHandler, forwardRef } from "react"
import { CommandItem } from "../ui/command"

const Item = forwardRef<
  React.ElementRef<typeof CommandItem>,
  React.ComponentPropsWithoutRef<typeof CommandItem>
>(({ className, ...props }, ref) => {
  const repositionHighlight: MouseEventHandler<HTMLDivElement> = (e) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect()

    const wrapper = document.querySelector("[cmdk-list-sizer]") as HTMLElement
    const highlight = document.querySelector(".highlight") as HTMLElement
    highlight.style.transform = `translateY(${
      rect.top - wrapper.getBoundingClientRect().top
    }px)`
    highlight.style.height = `${rect.height}px`
  }

  return (
    <CommandItem {...props} onMouseOver={repositionHighlight}></CommandItem>
  )
})
Item.displayName = "Item"

export { Item }
