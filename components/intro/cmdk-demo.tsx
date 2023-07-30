"use client"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import { useCommandState } from "cmdk"
import { Home, Laptop, Moon, Plus, Settings, SunMedium } from "lucide-react"
import { useEffect, useState } from "react"

export const CmdkDemo = () => {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [pages, setPages] = useState([])

  const [selected, setSelected] = useState("")
  const page = pages[pages.length - 1]

  const changePage = (page: string) => {
    setPages((pages) => [...pages, page])
    setSearch("")
  }

  useEffect(() => {
    const click = (e: MouseEvent) => {
      if (
        e.target instanceof Node &&
        !document.getElementById("cmdk-demo").contains(e.target)
      ) {
        setOpen(false)
      }
    }

    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && pages.length == 0) {
        setOpen(false)
      }
    }

    document.addEventListener("keydown", esc)

    document.addEventListener("click", click)
    return () => {
      document.removeEventListener("click", click)
      document.removeEventListener("keydown", esc)
    }
  }, [])

  return (
    <>
      <div
        className={` p relative z-10 h-52 overflow-hidden transition-[height] duration-300 dark:bg-black lg:pointer-events-auto ${
          open ? "open lg:h-96" : "lg:h-64"
        }`}
      >
        <Command
          onClick={() => setOpen(true)}
          id="cmdk-demo"
          value={selected}
          onValueChange={setSelected}
          onKeyDown={(e) => {
            // Escape goes to previous page
            // Backspace goes to previous page when search is empty
            if (
              (e.key === "Escape" && pages.length > 0) ||
              (e.key === "Backspace" && !search)
            ) {
              e.preventDefault()
              setPages((pages) => pages.slice(0, -1))
            }
          }}
          className={`command-demo [&_[cmdk-list-sizer]] absolute inset-x-0 top-8 ml-8 h-[320px] max-w-xl rounded-lg border p-1.5 transition duration-150 lg:mx-auto  [&_[cmdk-group-heading]]:relative  [&_[cmdk-group-heading]]:z-20
          [&_[cmdk-group-heading]]:px-1.5 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground 
           [&_[cmdk-group]:last-child]:pb-0 [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-1.5 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 
           [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:flex [&_[cmdk-item]]:cursor-pointer [&_[cmdk-item]]:items-center [&_[cmdk-item]]:gap-3 [&_[cmdk-item]]:px-3 
           [&_[cmdk-item]]:py-4 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5 [&_[cmdk-list-sizer]]:relative [&_[cmdk-list]]:h-[var(--cmdk-list-height)] [&_[cmdk-list]]:transition-[height]
           ${open ? "shadow-xl lg:z-50" : "shadow-md"}
           `}
        >
          <CommandInput
            value={search}
            autoFocus
            onValueChange={setSearch}
            placeholder="Type a command or search..."
          />
          <CommandList className="mt-1.5 max-h-[325px]">
            <Highlighter setSelected={setSelected} page={page} />
            {!page && (
              <>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup className="text-gray-11" heading="Editor">
                  <CommandItem>
                    <Plus /> New Document
                  </CommandItem>
                </CommandGroup>

                <CommandGroup className="text-gray-11" heading="General">
                  <CommandItem onSelect={() => changePage("theme")}>
                    <Laptop />
                    Change Theme
                  </CommandItem>
                  <CommandItem>
                    <Moon />
                    Change theme to Dark
                  </CommandItem>
                  <CommandItem>
                    <SunMedium />
                    Change theme to Light
                  </CommandItem>
                  <CommandItem>
                    <Laptop />
                    Change theme to System
                  </CommandItem>

                  <CommandItem>
                    <Home />
                    Dashboard
                  </CommandItem>

                  <CommandItem>
                    <Settings /> Settings
                  </CommandItem>
                </CommandGroup>
              </>
            )}
            {page == "theme" && (
              <>
                <CommandGroup className="text-gray-11" heading="Theme">
                  <CommandItem>
                    <SunMedium /> Light
                  </CommandItem>
                  <CommandItem>
                    <Moon />
                    Dark
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-12 bg-gradient-to-t from-white to-transparent transition dark:from-background" />
      </div>
    </>
  )
}

const Highlighter = ({
  page,
  setSelected,
}: {
  page: string
  setSelected: (value: string) => void
}) => {
  const repositionHighlight = (selected: string) => {
    const highlight = document.querySelector(
      ".command-demo .highlight"
    ) as HTMLElement

    if (selected) {
      const selectedElement = document.querySelector(
        '.command-demo  [cmdk-item][aria-selected="true"]'
      ) as HTMLElement
      // console.log(selectedElement.innerHTML)

      requestAnimationFrame(() => {
        highlight.style.transform = `translateY(${selectedElement?.offsetTop}px)`
        highlight.style.height = `${selectedElement?.getBoundingClientRect()
          .height}px`
      })
    } else {
      highlight.style.transform = `translateY(0)`
      highlight.style.height = `0`
    }
  }

  const selected = useCommandState((state) => state.value)
  useEffect(() => {
    repositionHighlight(selected)
  }, [selected, page])

  useEffect(() => {
    const firstItem = document.querySelector(".command-demo [cmdk-item]")
    if (page && firstItem) {
      firstItem.setAttribute("aria-selected", "true")
      setSelected(firstItem.getAttribute("data-value"))
    }
  }, [page])

  return (
    <div className="highlight absolute inset-x-0 top-0 z-0 rounded-[calc(var(--radius)-1.5px)] bg-accent transition-transform" />
  )
}
