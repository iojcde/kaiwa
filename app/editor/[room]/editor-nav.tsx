"use client";

import { useCollabContext } from "@/context/CollabContext";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

type ConnectionStatus = "connected" | "connecting" | "disconnected";

export const EditorNav = () => {
  const { provider: partykitProvider } = useCollabContext();
  const computedStatus = partykitProvider.wsconnected
    ? "connected"
    : partykitProvider.wsconnecting
    ? "connecting"
    : "disconnected";

  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>(computedStatus);
  if (connectionStatus !== computedStatus) {
    setConnectionStatus(computedStatus);
  }

  const users = partykitProvider.awareness.getStates();

  useEffect(() => {
    partykitProvider.on("status", (event: { status: ConnectionStatus }) => {
      setConnectionStatus(event.status);
      // console.log(event);
    });
  }, [partykitProvider]);

  const usersArray = [];

  for (let [key, value] of users.entries()) {
    const k = value?.user;
    if (k) k.id = key;
    usersArray.push(k);
  }

  return (
    <nav className="max-w-screen-xl px-6 flex items-center justify-between fixed top-0 inset-x-0 mx-auto w-full py-5">
      <Link
        // onClick={() => {
        //   console.log("destroying");
        //   partykitProvider.destroy();
        //   yDoc.destroy();
        // }}
        href="/dashboard"
        className="flex gap-2 items-center select-none"
      >
        <ChevronLeft size={16} />
        Back
      </Link>

      <div
        className={
          "before:content-[' '] flex items-center gap-4 text-xs before:block before:h-2 before:w-2 before:rounded-full before:bg-stone-300 data-[status='connected']:before:bg-emerald-500 sm:text-base text-gray-11"
        }
        data-status={connectionStatus}
      >
        <span className="overflow-ellipsis whitespace-nowrap group">
          {connectionStatus != "connecting" ? (
            <>
              {connectionStatus === "connected"
                ? `${users.size} user${users.size === 1 ? "" : "s"} online`
                : "offline"}
              {` `}
              <span className="hidden select-none sm:group-hover:inline">
                in room {partykitProvider.roomname}
              </span>
            </>
          ) : (
            <>
              Connecting{` `}
              <span className="hidden select-none sm:group-hover:inline">
                to room {partykitProvider.roomname}
              </span>
            </>
          )}
        </span>
        <div className="flex flex-row-reverse items-center group">
          {usersArray.length > 0 &&
            usersArray.map((user, n) => {
              if (n < 4) {
                return (
                  <Avatar
                    key={n}
                    className={`${
                      n != 0 && "-mr-4 group-hover:mr-0 transition-all"
                    } ring-offset-2 ring-2 w-8 h-8`}
                    style={
                      {
                        "--tw-ring-color": user?.color,
                        zIndex: usersArray.length - n,
                      } as React.CSSProperties
                    }
                  >
                    <AvatarImage src={user?.photo} alt={user?.name} />
                  </Avatar>
                );
              }
            })}
          {usersArray.length > 4 && (
            <span className="pr-2 text-gray-11">+{usersArray.length - 4}</span>
          )}
        </div>
        <div>
          <Button
            onClick={() =>
              navigator.clipboard.writeText(
                `https://nijika.jcde.xyz/editor/${partykitProvider.roomname}`
              )
            }
            size="sm"
            variant="outline"
          >
            Share
          </Button>
        </div>
      </div>
    </nav>
  );
};
