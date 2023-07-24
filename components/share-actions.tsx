"use client"

import { Access, AccessLevel } from "@prisma/client"
import { Button } from "./ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "./ui/select"

import { User } from "@prisma/client"
import { Avatar, AvatarImage } from "./ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"

import { Dispatch, SetStateAction, cache, useEffect, useState } from "react"
import { updatePublished } from "@/actions/update-published"
import { updateAccessLevels } from "@/actions/update-access-levels"
import { Check, ChevronsUpDown, Globe, Loader2, Lock } from "lucide-react"
import { cn } from "@/lib/utils"
import { FancyMultiSelect } from "./ui/fancy-multi-select"
import { inviteUsers } from "@/actions/invite-users"
import { useRouter } from "next/navigation"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog"

export type knownUser = Record<"id" | "photo" | "name" | "email", string>

export const ShareActions = ({
  room,
  title,
  session,
  access,
  published,
  knownUsers,
}) => {
  const [users, setUsers] = useState<knownUser[]>(knownUsers)
  const [open, setOpen] = useState(false)
  const [alertOpen, setAlertOpen] = useState(false)
  const [generalAccess, setGeneralAccess] = useState(
    published ? "link" : "restricted"
  )
  const [accessList, setAccessList] = useState<Access[]>(access)

  const [accessUpdateQue, setAccessUpdateQue] = useState<
    Record<string, AccessLevel | "DELETE">
  >({})
  const [isLoading, setIsLoading] = useState(false)

  const [invited, setInvited] = useState<knownUser[]>([])
  const [inviteLevel, setInviteLevel] = useState<AccessLevel>("VIEWER")

  const router = useRouter()

  useEffect(() => {
    setAccessList(access)
  }, [access])

  const pendingChanges =
    invited.length > 0 ||
    Object.keys(accessUpdateQue).length > 0 ||
    generalAccess != (published ? "link" : "restricted")
  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (open && pendingChanges) {
          setAlertOpen(true)
        } else {
          setOpen(o)
        }
      }}
    >
      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Discard unsaved changes?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Discard</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
        <DialogTrigger asChild>
          <Button variant="outline">Share</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl">
              Share {` `}
              &apos;
              {title}
              &apos;
            </DialogTitle>
          </DialogHeader>
          <div className="flex gap-2">
            <FancyMultiSelect
              selected={invited}
              setSelected={setInvited}
              users={users}
              setUsers={setUsers}
            />
            <Select
              defaultValue={inviteLevel}
              onValueChange={(v) => setInviteLevel(v as AccessLevel)}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Access" />
              </SelectTrigger>
              <SelectContent className="text-sm">
                <SelectItem value="VIEWER">Viewer</SelectItem>
                <SelectItem value="EDITOR">Editor</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="mt-8">
            <h2>People with Access</h2>
            <User accessId="0" user={session?.user} level="OWNER" />
            {accessList?.map((a: Access & { user: User }, i) => (
              <User
                accessId={a.id}
                user={a.user}
                key={i}
                level={a.level}
                setAccessList={setAccessList}
                setAccessUpdateQue={setAccessUpdateQue}
              />
            ))}
          </div>
          <div>
            <h2>General Access</h2>
            <Select
              defaultValue="restricted"
              value={generalAccess}
              onValueChange={setGeneralAccess}
            >
              <div className="mt-2 flex items-center gap-3">
                <div
                  className={`rounded-full p-2 ${
                    generalAccess == "link" ? "bg-green-5" : "bg-red-5"
                  }`}
                >
                  {generalAccess == "link" ? <Globe /> : <Lock />}
                </div>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Access" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="restricted">Restricted</SelectItem>
                  <SelectItem value="link">Anyone with the link</SelectItem>
                </SelectContent>
              </div>
            </Select>
          </div>

          <DialogFooter className="flex items-center gap-2">
            {pendingChanges && (
              <div className="text-sm text-gray-11">Pending Changes</div>
            )}
            <Button
              onClick={async () => {
                setIsLoading(true)

                await updatePublished({
                  room,
                  published: generalAccess == "link",
                })

                await updateAccessLevels(room, accessUpdateQue)

                await inviteUsers({
                  invitedUsers: invited,
                  room,
                  level: inviteLevel,
                })
                setAccessUpdateQue({})
                setInvited([])
                setIsLoading(false)
                setOpen(!open)

                router.refresh()
              }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </AlertDialog>
    </Dialog>
  )
}

const User = ({
  user,
  level,
  accessId,
  setAccessUpdateQue,
  setAccessList,
}: {
  user: User
  level: AccessLevel
  accessId: string
  accessList?: Access[]
  setAccessList?: Dispatch<SetStateAction<Access[]>>
  setAccessUpdateQue?: Dispatch<
    SetStateAction<Record<string, AccessLevel | "DELETE">>
  >
}) => (
  <div className="flex items-center justify-between gap-2 py-2">
    <div className="flex items-center gap-3">
      <Avatar className="h-8 w-8">
        <AvatarImage src={user?.image} />
      </Avatar>
      <div className="flex flex-col text-sm">
        <span className="">
          {user?.name} {level == "OWNER" ? " (you)" : ""}
        </span>
        <span className="text-xs text-gray-11">{user?.email}</span>
      </div>
    </div>
    <div className="">
      {level == "OWNER" ? (
        <div className="w-[100px] px-3 text-sm">Owner</div>
      ) : (
        <Select
          defaultValue={level}
          onValueChange={(v) => {
            setAccessUpdateQue((q) => ({
              ...q,
              [accessId]: v as AccessLevel | "DELETE",
            }))

            if (v == "DELETE") {
              setAccessList((prev) => prev.filter((a) => a.id != accessId))
            }
          }}
        >
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="Access" />
          </SelectTrigger>
          <SelectContent className="text-sm">
            <SelectItem value="VIEWER">Viewer</SelectItem>
            <SelectItem value="EDITOR">Editor</SelectItem>
            <SelectSeparator />
            <SelectItem value="DELETE">Remove Access</SelectItem>
          </SelectContent>
        </Select>
      )}
    </div>
  </div>
)
