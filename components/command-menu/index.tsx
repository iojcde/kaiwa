"use client"

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
} from "@/components/ui/command"
import { Item } from "./item"
import { useEffect, useState } from "react"
import { Dialog, DialogContent } from "../ui/dialog"
import { useTheme } from "next-themes"

import { Laptop, Moon, Plus, SunMedium } from "lucide-react"
import { createPost } from "@/actions/create-post"
import { toast } from "../ui/use-toast"
import { Post } from "@prisma/client"

export function CommandMenu() {
  const [open, setOpen] = useState(false)

  const [search, setSearch] = useState("")
  const [pages, setPages] = useState([])
  const page = pages[pages.length - 1]

  const [tabBoundingBox, setTabBoundingBox] = useState(null)

  const { theme, setTheme } = useTheme()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        toggleOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const toggleOpen = (open: boolean | ((open: boolean) => boolean)) => {
    if (open) {
      setSearch("")
      setPages([])
    }
    setOpen(open)
  }

  const triggerTheme = (theme: "dark" | "light" | "system") => {
    setTheme(theme)
    toggleOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={toggleOpen}>
      <DialogContent className="top-[20%] max-w-xl translate-y-0 overflow-hidden border-x-0  p-0 shadow-xl data-[state=closed]:slide-out-to-top-[2%] data-[state=open]:slide-in-from-top-[2%]  sm:border-x ">
        <Command
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
          className="p-1.5 [&_[cmdk-group-heading]]:relative [&_[cmdk-group-heading]]:z-20  [&_[cmdk-group-heading]]:px-1 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-1 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:flex [&_[cmdk-item]]:items-center [&_[cmdk-item]]:gap-3 [&_[cmdk-item]]:px-3 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5 [&_[cmdk-list-sizer]]:relative [&_[cmdk-list]]:h-[var(--cmdk-list-height)]  [&_[cmdk-list]]:transition-[height]"
        >
          <CommandInput
            value={search}
            onValueChange={setSearch}
            placeholder="Type a command or search..."
          />
          <CommandList>
            <div className="highlight absolute inset-x-0 z-0 rounded-md bg-accent transition" />
            {!page && (
              <>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup className="text-gray-11" heading="Editor">
                  <Item
                    onClick={async () => {
                      let post: Post
                      try {
                        post = await createPost()
                      } catch {
                        return toast({
                          title: "Something went wrong.",
                          description:
                            "Your post was not created. Please try again.",
                          variant: "destructive",
                        })
                      }
                    }}
                  >
                    <Plus /> New Document
                  </Item>
                </CommandGroup>

                <CommandGroup className="text-gray-11" heading="General">
                  <Item onSelect={() => setPages([...pages, "theme"])}>
                    <Laptop />
                    Change Theme
                  </Item>
                  <Item onSelect={() => triggerTheme("dark")}>
                    <Moon />
                    Change theme to Dark
                  </Item>
                  <Item onSelect={() => triggerTheme("light")}>
                    <SunMedium />
                    Change theme to Light
                  </Item>
                  <Item onSelect={() => triggerTheme("system")}>
                    <Laptop />
                    Change theme to System
                  </Item>

                  <Item>Calculator</Item>
                </CommandGroup>
              </>
            )}
            {page == "theme" && (
              <>
                <CommandGroup className="text-gray-11" heading="Theme">
                  <Item onSelect={() => triggerTheme("light")}>
                    <SunMedium /> Light
                  </Item>
                  <Item onSelect={() => triggerTheme("dark")}>
                    <Moon />
                    Dark
                  </Item>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  )
}
