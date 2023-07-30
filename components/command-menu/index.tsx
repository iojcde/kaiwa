"use client"

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandInput,
  CommandList,
} from "@/components/ui/command"
import { useEffect, useRef, useState } from "react"
import { Dialog, DialogContent } from "../ui/dialog"
import { useTheme } from "next-themes"
import { wait } from "@/lib/utils"
import { Home, Laptop, Moon, Plus, Settings, SunMedium } from "lucide-react"
import { createPost } from "@/actions/create-post"
import { toast } from "../ui/use-toast"
import { Post } from "@prisma/client"
import { useCommandState } from "cmdk"
import { redirect, useRouter } from "next/navigation"

export function CommandMenu() {
  const router = useRouter()

  const [open, setOpen] = useState(false)

  const [search, setSearch] = useState("")
  const [pages, setPages] = useState([])

  const [selected, setSelected] = useState("")
  const page = pages[pages.length - 1]

  const { theme, setTheme } = useTheme()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        toggleOpen((open) => !open)
      }
    }

    const touch = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        toggleOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    document.addEventListener("touchstart", touch)
    return () => {
      document.removeEventListener("keydown", down)
      document.removeEventListener("touchstart", touch)
    }
  }, [])

  const toggleOpen = (open: boolean | ((open: boolean) => boolean)) => {
    if (open) {
      setSearch("")
      setSelected("")
      setPages([])
    }
    setOpen(open)
  }

  const triggerTheme = (theme: "dark" | "light" | "system") => {
    setTheme(theme)
    toggleOpen(false)
  }

  const changePage = (page: string) => {
    const commandMenu = document.querySelector(".command-menu") as HTMLElement

    commandMenu.style.transform = `translate(-50%, 0) scale(0.99)`
    commandMenu.style.transition = "transform 0.1s ease 0s"
    setTimeout(()=>{
      
    commandMenu.style.transform = ``
    commandMenu.style.transition = ""
    },100)

    setPages((pages) => [...pages, page])
    setSearch("")
  }

  return (
    <Dialog open={open} onOpenChange={toggleOpen}>
      <DialogContent className="command-menu ease-ease bottom-0 top-0 flex max-w-[38rem] flex-col gap-0 overflow-hidden  border-x-0 p-0 shadow-xl outline-none transition-all duration-100  sm:bottom-auto sm:top-[20%] sm:border-x">
        <div className="flex h-[40px] gap-2 bg-background p-2 px-4 text-xs text-gray-11 ">
          <button className="rounded bg-gray-3 px-2 py-1">Home</button>
          {pages.map((page, i) => (
            <button
              className="rounded bg-gray-3 px-2 py-1 outline-none"
              key={i}
            >
              {page}
            </button>
          ))}
        </div>
        <Command
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
          className="[&_[cmdk-list-sizer]] rounded-none p-1.5 [&_[cmdk-group-heading]]:relative  [&_[cmdk-group-heading]]:z-20
          [&_[cmdk-group-heading]]:px-1.5 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground 
           [&_[cmdk-group]:last-child]:pb-0 [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-1.5 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 
           [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:flex [&_[cmdk-item]]:cursor-pointer [&_[cmdk-item]]:items-center [&_[cmdk-item]]:gap-3 [&_[cmdk-item]]:px-3 
           [&_[cmdk-item]]:py-4 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5 [&_[cmdk-list-sizer]]:relative [&_[cmdk-list]]:h-[var(--cmdk-list-height)] [&_[cmdk-list]]:transition-[height]"
        >
          <CommandInput
            value={search}
            autoFocus
            onValueChange={setSearch}
            placeholder="Type a command or search..."
          />
          <CommandList className="mt-1.5 h-full max-h-none  sm:max-h-[325px]">
            <Highlighter setSelected={setSelected} page={page} />
            {!page && (
              <>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup className="text-gray-11" heading="Editor">
                  <CommandItem
                    onSelect={async () => {
                      let post: Post
                      try {
                        post = await createPost()
                      } catch (e) {
                        toast({
                          title: "Something went wrong.",
                          description:
                            "Your post was not created. Please try again.",
                          variant: "destructive",
                        })
                      }

                      redirect(`/editor/${post.id}`)
                    }}
                  >
                    <Plus /> New Document
                  </CommandItem>
                </CommandGroup>

                <CommandGroup className="text-gray-11" heading="General">
                  <CommandItem onSelect={() => changePage("theme")}>
                    <Laptop />
                    Change Theme
                  </CommandItem>
                  <CommandItem onSelect={() => triggerTheme("dark")}>
                    <Moon />
                    Change theme to Dark
                  </CommandItem>
                  <CommandItem onSelect={() => triggerTheme("light")}>
                    <SunMedium />
                    Change theme to Light
                  </CommandItem>
                  <CommandItem onSelect={() => triggerTheme("system")}>
                    <Laptop />
                    Change theme to System
                  </CommandItem>

                  <CommandItem
                    onSelect={() => {
                      router.push("/dashboard")
                      toggleOpen(false)
                    }}
                  >
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
                  <CommandItem onSelect={() => triggerTheme("light")}>
                    <SunMedium /> Light
                  </CommandItem>
                  <CommandItem onSelect={() => triggerTheme("dark")}>
                    <Moon />
                    Dark
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
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
      ".command-menu .highlight"
    ) as HTMLElement

    if (selected) {
      const selectedElement = document.querySelector(
        '.command-menu  [cmdk-item][aria-selected="true"]'
      ) as HTMLElement
      // console.log(selectedElement.innerHTML)

      highlight.style.transform = `translateY(${selectedElement?.offsetTop}px)`
      highlight.style.height = `${selectedElement?.getBoundingClientRect()
        .height}px`
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
    const firstItem = document.querySelector(".command-menu [cmdk-item]")
    if (firstItem) {
      firstItem.setAttribute("aria-selected", "true")
      setSelected(firstItem.getAttribute("data-value"))
    }
  }, [page])

  return (
    <div className="highlight ease-ease absolute inset-x-0 top-0 z-0 rounded-[calc(var(--radius)-1.5px)]  bg-accent transition-transform " />
  )
}
