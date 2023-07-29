import { config } from "@/components/editor/slash/config"
import { SlashItem } from "@/components/editor/slash/SlashItem"
import { useSlashState } from "@/components/editor/slash/state"
import { SlashProvider } from "@milkdown/plugin-slash"
import { useInstance } from "@milkdown/react"
import { usePluginViewContext } from "@prosemirror-adapter/react"
import { useEffect, useRef } from "react"

export const Slash = () => {
  const { view, prevState } = usePluginViewContext()
  const slashProvider = useRef<SlashProvider>()
  const ref = useRef<HTMLDivElement>(null)
  const instance = useInstance()
  const [loading] = instance
  const { root, setOpened, onKeydown, setSelected, selected } =
    useSlashState(instance)

  useEffect(() => {
    if (!ref.current || loading) return

    slashProvider.current ??= new SlashProvider({
      content: ref.current,
      debounce: 0,
      tippyOptions: {
        animation: "fade",
        duration: 150,
        onShow: () => {
          setOpened(true)
          root?.addEventListener("keydown", onKeydown)
        },
        onHide: () => {
          setSelected(0)
          setOpened(false)
          root?.removeEventListener("keydown", onKeydown)
        },
      },
    })

    return () => {
      slashProvider.current?.destroy()
      slashProvider.current = undefined
    }
  }, [loading, onKeydown, root, setOpened, setSelected])

  useEffect(() => {
    slashProvider.current?.update(view, prevState)
  })

  return (
    <div className="hidden">
      <div role="tooltip" ref={ref}>
        <ul className="m-0 w-80 list-none gap-2 overflow-clip rounded-md border bg-background p-2 text-gray-12 shadow-xl">
          {config.map((item, i) => {
            const Icon = item.icon
            return (
              <SlashItem
                key={i.toString()}
                index={i}
                instance={instance}
                onSelect={(ctx) => item.onSelect(ctx)}
                selected={i === selected}
                setSelected={setSelected}
              >
                <div className="flex items-center gap-3">
                  <div className="rounded border bg-white p-2 dark:bg-black">
                    <Icon size={20} />
                  </div>
                  <div>
                    <div className="text-sm font-medium">{item.title}</div>
                    <div className="text-xs text-gray-11">
                      {item.description}
                    </div>
                  </div>
                </div>
              </SlashItem>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
