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
      debounce: 50,
      tippyOptions: {
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
        <ul className="m-0 w-96 list-none overflow-clip rounded-sm bg-background border text-gray-12 shadow-xl">
          {config.map((item, i) => (
            <SlashItem
              key={i.toString()}
              index={i}
              instance={instance}
              onSelect={(ctx) => item.onSelect(ctx)}
              selected={i === selected}
              setSelected={setSelected}
            >
              {item.renderer}
            </SlashItem>
          ))}
        </ul>
      </div>
    </div>
  )
}
