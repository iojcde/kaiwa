"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCollabContext } from "@/context/CollabContext";
import { ChevronLeft } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useUsers } from "y-presence";

const Animal = dynamic(() => import("react-animals"), { ssr: false });

type ConnectionStatus = "connected" | "connecting" | "disconnected";
export const EditorNav = ({ shareButton }) => {
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

  useEffect(() => {
    partykitProvider.on("status", (event: { status: ConnectionStatus }) => {
      setConnectionStatus(event.status);
    });
  }, [partykitProvider]);

  const users = useUsers(partykitProvider.awareness, (state) =>
    Array.from(state.values(), (v) => v.user)
  );

  return (
    <nav className="max-w-screen-xl px-6 flex items-center justify-between fixed top-0 inset-x-0 mx-auto w-full py-5">
      <Link
        // onClick={() => {
        //   console.log("destroying");
        //   partykitProvider.destroy();
        //   yDoc.destroy();
        // }}
        href="/dashboard"
        className="flex gap-1 items-center select-none"
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
        <span className="overflow-ellipsis whitespace-nowrap group text-sm sm:text-base">
          {connectionStatus != "connecting" ? (
            <>
              {connectionStatus === "connected"
                ? `${users.length} user${users.length === 1 ? "" : "s"} online`
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
        {shareButton}

        <div className="flex flex-row-reverse items-center group">
          {users.length > 0 &&
            users.map(
              (user: { name: string; photo: string; color: string }, n) => {
                if (n < 4) {
                  return (
                    <Avatar
                      key={n}
                      className={`${
                        n != 0
                          ? "-mr-4 group-hover:mr-0 transition-all w-8 h-8"
                          : "w-9 h-9"
                      } ring-offset-2 ring-2`}
                      style={
                        {
                          "--tw-ring-color": user?.color,
                          zIndex: users?.length - n,
                        } as React.CSSProperties
                      }
                    >
                      <AvatarImage
                        className={n == 0 && "w-9 h-9"}
                        src={user?.photo}
                        alt={user?.name}
                      />
                      <AvatarFallback>
                        {user && (
                          <Animal
                            color={user.color}
                            name={user.name.split("-")[1]}
                          />
                        )}
                      </AvatarFallback>
                    </Avatar>
                  );
                }
              }
            )}
          {users.length > 4 && (
            <span className="pr-2 text-gray-11">+{users.length - 4}</span>
          )}
        </div>
      </div>
    </nav>
  );
};
