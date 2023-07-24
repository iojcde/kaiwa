"use client"

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { useEffect, useState } from "react"
import { Dialog, DialogContent } from "../ui/dialog"
import { useTheme } from "next-themes"

import { Laptop, Moon, SunMedium } from "lucide-react"
import { createPost } from "@/actions/create-post"
import { toast } from "../ui/use-toast"
import { Post } from "@prisma/client"

export function CommandMenu() {
  const [open, setOpen] = useState(false)

  const [search, setSearch] = useState("")
  const [pages, setPages] = useState([])
  const page = pages[pages.length - 1]

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

  return (
    <Dialog open={open} onOpenChange={toggleOpen}>
      <DialogContent className="overflow-hidden p-0 shadow-lg">
        <Command
          onKeyDown={(e) => {
            // Escape goes to previous page
            // Backspace goes to previous page when search is empty
            if (e.key === "Escape" || (e.key === "Backspace" && !search)) {
              e.preventDefault()
              setPages((pages) => pages.slice(0, -1))
            }
          }}
          className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5"
        >
          <CommandInput
            value={search}
            onValueChange={setSearch}
            placeholder="Type a command or search..."
          />
          <CommandList>
            {!page && (
              <>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Suggestions">
                  <CommandItem
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
                    New Document
                  </CommandItem>
                  <CommandItem onSelect={() => setPages([...pages, "theme"])}>
                    Change Theme
                  </CommandItem>
                  <CommandItem>
                    <Moon className="mr-2 h-4 w-4" />
                    Change theme to Dark
                  </CommandItem>
                  <CommandItem>
                    <SunMedium className="mr-2 h-4 w-4" />
                    Change theme to Light
                  </CommandItem>
                  <CommandItem>
                    <Laptop className="mr-2 h-4 w-4" />
                    Change theme to System
                  </CommandItem>

                  <CommandItem>Calculator</CommandItem>
                </CommandGroup>
              </>
            )}
            {page == "theme" && (
              <>
                <CommandGroup heading="Theme">
                  <CommandItem
                    onSelect={() => {
                      setTheme("light")
                      toggleOpen(false)
                    }}
                  >
                    <SunMedium className="mr-2 h-4 w-4" /> Light
                  </CommandItem>
                  <CommandItem
                    onSelect={() => {
                      setTheme("dark")
                      toggleOpen(false)
                    }}
                  >
                    <Moon className="mr-2 h-4 w-4" />
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
