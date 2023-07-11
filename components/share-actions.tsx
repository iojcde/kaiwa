"use client";

import { Access, AccessLevel } from "@prisma/client";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

import { User } from "@prisma/client";
import { Avatar, AvatarImage } from "./ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

import { Dispatch, SetStateAction, cache, useState } from "react";
import { updatePublished } from "@/actions/update-published";
import { updateAccessLevels } from "@/actions/update-access-levels";
import { Globe, Loader2, Lock } from "lucide-react";

export const ShareActions = ({ room, title, session, access, published }) => {
  const [open, setOpen] = useState(false);
  const [generalAccess, setGeneralAccess] = useState(
    published ? "link" : "restricted"
  );
  const [accessUpdateQue, setAccessUpdateQue] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
        <div>
          <h2>People with Access</h2>
          <User accessId="0" user={session?.user} level="OWNER" />
          {access?.map((a: Access & { user: User }, i) => (
            <User
              accessId={a.id}
              user={a.user}
              key={i}
              level={a.level}
              accessUpdateQue={accessUpdateQue}
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
            <div className="flex items-center gap-3 mt-2">
              <div
                className={`p-2 rounded-full ${
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
        <DialogFooter>
          <Button
            onClick={async () => {
              setIsLoading(true);
              await cache(
                async (room, generalAccess) =>
                  await updatePublished({
                    room,
                    published: generalAccess == "link",
                  })
              )(room, generalAccess);

              await cache(async (accessUpdateQue) => {
                await updateAccessLevels(accessUpdateQue);
              })(accessUpdateQue);
              setIsLoading(false);
              setOpen(!open);
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
      </DialogContent>{" "}
    </Dialog>
  );
};

const User = ({
  user,
  level,
  accessId,
  setAccessUpdateQue,
  accessUpdateQue,
}: {
  user: User;
  level: AccessLevel;
  accessId: string;
  setAccessUpdateQue?: Dispatch<SetStateAction<Record<string, AccessLevel>>>;

  accessUpdateQue?: Record<string, AccessLevel>;
}) => (
  <div className="flex gap-2 justify-between py-2 items-center">
    <div className="flex items-center gap-3">
      <Avatar className="w-8 h-8">
        <AvatarImage src={user?.image} />
      </Avatar>
      <div className="flex flex-col text-sm">
        <span className="">
          {user?.name} {level == "OWNER" ? " (you)" : ""}
        </span>
        <span className="text-gray-11 text-xs">{user?.email}</span>
      </div>
    </div>
    <div className="">
      {level == "OWNER" ? (
        <div className="w-[100px] px-3 text-sm">Owner</div>
      ) : (
        <Select
          defaultValue={level}
          onValueChange={(v) => {
            let tmp = accessUpdateQue;
            tmp[accessId] = v as AccessLevel;
            setAccessUpdateQue(tmp);
          }}
        >
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="Access" />
          </SelectTrigger>
          <SelectContent className="text-sm">
            <SelectItem value="VIEWER">Viewer</SelectItem>
            <SelectItem value="EDITOR">Editor</SelectItem>
          </SelectContent>
        </Select>
      )}
    </div>
  </div>
);
