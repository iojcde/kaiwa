import * as React from "react"
import { AlertTriangle, X } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Command, CommandGroup, CommandItem } from "@/components/ui/command"
import { Command as CommandPrimitive } from "cmdk"
import { knownUser } from "../share-actions"
import { cn } from "@/lib/utils"

export function FancyMultiSelect({
  users,
  setUsers,
  selected,
  setSelected,
}: {
  users: knownUser[]
  setUsers: React.Dispatch<React.SetStateAction<knownUser[]>>
  selected: knownUser[]
  setSelected: React.Dispatch<React.SetStateAction<knownUser[]>>
}) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [open, setOpen] = React.useState(false)

  const [inputValue, setInputValue] = React.useState("")

  const handleUnselect = React.useCallback((users: knownUser) => {
    setSelected((prev) => prev.filter((s) => s.id !== users.id))
  }, [])

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current
      if (input) {
        if (e.key === "Delete" || e.key === "Backspace") {
          if (input.value === "") {
            setSelected((prev) => {
              const newSelected = [...prev]
              newSelected.pop()
              return newSelected
            })
          }
        }
        // This is not a default behaviour of the <input /> field
        if (e.key === "Escape") {
          input.blur()
        }
        if (
          e.key === "Enter" &&
          selectables.length === 0 &&
          input.value != ""
        ) {
          const newUser: knownUser = {
            id: "",
            photo: "",
            email: input.value,
            name: input.value,
          }
          !users.find((u) => u.email == input.value) &&
            setSelected((prev) => [...prev, newUser])

          setInputValue("")
        }
      }
    },
    []
  )

  const selectables = users.filter((user) => !selected.includes(user))

  return (
    <Command
      onKeyDown={handleKeyDown}
      className="overflow-visible bg-transparent flex-1"
    >
      <div className="group self-stretch rounded-md border  border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        <div className="flex flex-wrap gap-1">
          {selected.map((user) => {
            return (
              <Badge
                key={user.id}
                variant="secondary"
                className="flex items-center gap-2"
              >
                {(!user.email.includes("@") || !user.email.includes(".")) && (
                  <AlertTriangle size={16} className="text-yellow-10" />
                )}
                {user.name}
                <button
                  className="rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleUnselect(user)
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                  onClick={() => handleUnselect(user)}
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </button>
              </Badge>
            )
          })}
          {/* Avoid having the "Search" Icon */}
          <CommandPrimitive.Input
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            placeholder="Add users..."
            className="ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>
      <div className="relative mt-2">
        {open && selectables.length > 0 ? (
          <div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
            <CommandGroup className="h-full overflow-auto">
              {selectables.map((user) => {
                return (
                  <CommandItem
                    key={user.id}
                    keywords={[user.name, user.email]}
                    onMouseDown={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                    }}
                    onSelect={(value) => {
                      setInputValue("")
                      setSelected((prev) => [...prev, user])
                    }}
                    className={"grid cursor-pointer "}
                  >
                    {user.name}
                    <div className="text-xs text-gray-11 ">{user.email}</div>
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </div>
        ) : null}
      </div>
    </Command>
  )
}

const CommandItemCreate = ({
  inputValue,
  users,
  onSelect,
}: {
  inputValue: string
  users: knownUser[]
  onSelect: () => void
}) => {
  const hasNoFramework = !users
    .map(({ email }) => email)
    .includes(`${inputValue.toLowerCase()}`)

  const render = inputValue !== "" && hasNoFramework

  if (!render) return null

  // BUG: whenever a space is appended, the Create-Button will not be shown.
  return (
    <CommandItem
      key={`${inputValue}`}
      value={`${inputValue}`}
      className="text-xs text-muted-foreground"
      onSelect={onSelect}
    >
      <div className={cn("mr-2 h-4 w-4")} />
      Create new label &quot;{inputValue}&quot;
    </CommandItem>
  )
}
