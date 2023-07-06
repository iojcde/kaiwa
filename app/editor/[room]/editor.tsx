"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";
import { Editor, rootCtx } from "@milkdown/core";
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
import { EditorNav } from "./editor-nav";
import { CollabProvider, useCollabContext } from "@/lib/collabContext";

const doc = new Doc();

const MilkdownEditor: React.FC<{
  save: typeof save;
  room: string;
}> = ({ room, save }) => {
  const { status, data: session } = useSession();

  const { provider: partykitProvider, initProvider } = useCollabContext();

  useEffect(() => {
    initProvider(room, session?.wsToken);

    status == "authenticated" &&
      partykitProvider.roomname != "offline-room" &&
      partykitProvider.connect();
  }, [room, status]);

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

  if (status == "authenticated") {
    partykitProvider.awareness.setLocalStateField("user", {
      color: "#FFC0CB",
      name: session.user.name,
    });
  } else {
    return;
  }

  get()?.action((ctx) => {
    const collabService = ctx.get(collabServiceCtx);
    collabService.setOptions({
      yCursorOpts: {
        cursorBuilder: (user) => {
          console.log("why no user kewkkekwk cursrobuildr");
          const cursor = document.createElement("span");
          cursor.classList.add("ProseMirror-yjs-cursor");
          cursor.setAttribute("style", `border-color: ${user.color}`);
          const userDiv = document.createElement("div");
          userDiv.setAttribute("style", `background-color: ${user.color}`);
          userDiv.classList.add(
            "p-1",
            "px-2",
            "text-xs",
            "font-normal",
            "rounded-full"
          );
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
  return (
    <div
      className={partykitProvider.wsconnected ? "connected" : "disconnected"}
    >
      <Milkdown />
    </div>
  );
};

const MilkdownEditorWrapper: React.FC<{
  save: typeof save;
  room: string;
}> = ({ save, room }) => {
  return (
    <CollabProvider>
      <MilkdownProvider>
        <MilkdownEditor save={save} room={room} />
      </MilkdownProvider>
    </CollabProvider>
  );
};
export default MilkdownEditorWrapper;
