"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import { Editor, rootCtx, schema, schemaCtx } from "@milkdown/core";
import { Milkdown, MilkdownProvider, useEditor } from "@milkdown/react";
import { gfm } from "@milkdown/preset-gfm";
import { commonmark } from "@milkdown/preset-commonmark";
import { theme } from "@/milkdown/theme";
import { clipboard } from "@milkdown/plugin-clipboard";
import { history } from "@milkdown/plugin-history";
import {
  placeholder,
  placeholderCtx,
  placeholderEnabledCtx,
} from "@/milkdown/plugins/placeholder";
import type { save } from "./save";
import { collab, collabServiceCtx } from "@milkdown/plugin-collab";
import YpartykitProvider from "y-partykit/provider";
import { Doc } from "yjs";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { yDocToProsemirror } from "y-prosemirror";

const doc = new Doc();

const MilkdownEditor: React.FC<{
  save: typeof save;
  room: string;
}> = ({ room, save }) => {
  const { status, data: session } = useSession();

  const partykitProvider = useMemo(() => {
    return new YpartykitProvider(`nijika.iojcde.partykit.dev`, room, doc, {
      connect: false,
    });
  }, [room]);

  useEffect(() => {
    if (status == "authenticated" && session?.wsToken) {
      const url = new URL(partykitProvider.url);
      url.searchParams.set("token", session?.wsToken);
      partykitProvider.url = url.toString();
      partykitProvider.connect();

      partykitProvider.awareness.setLocalStateField("user", {
        color: "#FFC0CB",
        name: session.user.name,
      });
    }
  }, [status]);

  const { get } = useEditor((root) =>
    Editor.make()
      .config(theme)
      .config((ctx) => {
        ctx.set(rootCtx, root as Node);
        ctx.set(placeholderCtx, "Type here to write your post...");
      })
      .use(commonmark)
      .use(gfm)
      .use(clipboard)
      .use(placeholder)
      .use(history)
      .use(collab)
  );

  get()?.action((ctx) => {
    const collabService = ctx.get(collabServiceCtx);
    collabService.setOptions({
      yCursorOpts: {
        cursorBuilder: (user) => {
          const cursor = document.createElement("span");
          cursor.classList.add("ProseMirror-yjs-cursor");
          cursor.setAttribute("style", `border-color: ${user.color}`);
          const userDiv = document.createElement("div");
          userDiv.setAttribute("style", `background-color: ${user.color}`);
          userDiv.classList.add("p-1", "px-2", "font-normal", "rounded-full");
          userDiv.insertBefore(document.createTextNode(user.name), null);
          cursor.insertBefore(userDiv, null);
          return cursor;
        },
      },
    });
    collabService
      // bind doc and awareness
      .bindDoc(doc)
      .setAwareness(partykitProvider.awareness)
      // connect yjs with milkdown
      .connect();

    partykitProvider.once("synced", async (isSynced: boolean) => {
      ctx.set(placeholderEnabledCtx, true);
    });
  });

  const connectionStatus = partykitProvider.wsconnected
    ? "connected"
    : partykitProvider.wsconnecting
    ? "connecting"
    : "disconnected";

  const users = partykitProvider.awareness.getStates();
  return (
    <div
      className={partykitProvider.wsconnected ? "connected" : "disconnected"}
    >
      <nav className="max-w-screen-xl px-6 flex items-center justify-between fixed top-0 inset-x-0 mx-auto w-full py-5">
        <Link href="/dashboard" className="flex gap-2 items-center">
          <ChevronLeft size={16} />
          Back
        </Link>
        <div
          className={
            "before:content-[' ']  group flex items-center gap-1.5 text-xs before:block before:h-2 before:w-2 before:rounded-full before:bg-stone-300 data-[status='connected']:before:bg-emerald-500 sm:text-base"
          }
          data-status={connectionStatus}
        >
          <span className="overflow-ellipsis whitespace-nowrap">
            {connectionStatus === "connected"
              ? `${users.size} user${users.size === 1 ? "" : "s"} online`
              : "offline"}{" "}
            <span className="hidden group-hover:inline">in room {room}</span>
          </span>
        </div>
      </nav>
      <Milkdown />
    </div>
  );
};

const MilkdownEditorWrapper: React.FC<{
  save: typeof save;
  room: string;
}> = ({ save, room }) => {
  return (
    <MilkdownProvider>
      <MilkdownEditor save={save} room={room} />
    </MilkdownProvider>
  );
};
export default MilkdownEditorWrapper;
