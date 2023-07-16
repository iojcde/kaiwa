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
import { useEffect, useState } from "react"

export const CmdkDemo = () => {
  const [open, setOpen] = useState(false)

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
      if (e.key === "Escape") {
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
        className={`relative z-10 overflow-hidden dark:bg-black transition-all ${
          open ? "h-52 lg:h-96 " : "h-52 lg:h-64"
        }`}
      >
        <Command
          id="cmdk-demo"
          onClick={() => setOpen(true)}
          className={`absolute top-8 h-[320px] inset-x-0 max-w-xl ml-8 lg:mx-auto rounded-xl border transition duration-150 ${
            open ? "z-50 shadow-xl" : "shadow-md"
          }`}
        >
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              <CommandItem>Calendar</CommandItem>
              <CommandItem>Search Emoji</CommandItem>
              <CommandItem>Calculator</CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Settings">
              <CommandItem>Profile</CommandItem>
              <CommandItem>Billing</CommandItem>
              <CommandItem>Settings</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-12 bg-gradient-to-t from-white to-transparent dark:from-background" />
      </div>
    </>
  )
}
