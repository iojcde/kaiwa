"use client";
import type { Heading, Root, Text } from "mdast";
import React, { useEffect, useMemo, useRef, useState } from "react";
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
import { listener, listenerCtx } from "@milkdown/plugin-listener";
import { unified } from "unified";
import remarkParse from "remark-parse";
import { debounce } from "lodash";
import rehypeSanitize from "rehype-sanitize";
import remarkRehype from "remark-rehype";
import { Button } from "@/components/ui/button";

type ConnectionStatus = "connected" | "connecting" | "disconnected";

const MilkdownEditor: React.FC<{
  save: typeof save;
  room: string;
}> = ({ room, save }) => {
  const [partykitProvider, setPartykitProvider] = useState(
    new YpartykitProvider(
      `nijika.iojcde.partykit.dev`,
      "offline-room",
      new Doc(),
      {
        connect: false,
      }
    )
  );
  const [doc, setDoc] = useState(new Doc());
  const { status, data: session } = useSession();

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("beforeunload", () => {
        if (partykitProvider.wsconnected) partykitProvider.destroy();
      });
    }
  });

  useEffect(() => {
    console.log("creating partykitProvider");
    const doc = new Doc();
    setDoc(doc);

    setPartykitProvider(
      new YpartykitProvider(`nijika.iojcde.partykit.dev`, room, doc, {
        connect: false,
      })
    );

    return () => {
      partykitProvider.destroy();
      doc.destroy();
    };
  }, [setDoc, room]);

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
      console.log(event);
    });
  }, [partykitProvider]);

  useEffect(() => {
    if (
      status == "authenticated" &&
      session?.wsToken &&
      partykitProvider.roomname != "offline-room"
    ) {
      const url = new URL(partykitProvider.url);
      url.searchParams.set("token", session?.wsToken);
      partykitProvider.url = url.toString();
      partykitProvider.connect();

      partykitProvider.awareness.setLocalStateField("user", {
        color: "#FFC0CB",
        name: session.user.name,
      });
    }
  }, [status, partykitProvider]);

  const saveTitle = debounce(async (title) => {
    const res = await fetch("/api/post/title", {
      method: "POST",
      body: JSON.stringify({ title, room }),
    });
    if (!res.ok) {
      console.log(res);
    }
  }, 2000);

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
      .use(listener)
      .config((ctx) => {
        const listener = ctx.get(listenerCtx);

        listener.markdownUpdated(async (ctx, markdown, prevMarkdown) => {
          if (markdown !== prevMarkdown && markdown !== "") {
            const title = await getTitle(markdown);
            document.title = title;

            saveTitle(title);
          }
        });
      })
  );

  const getTitle = async (markdown: string) => {
    const tree = unified()
      .use(remarkParse)
      .use(rehypeSanitize)
      .use(remarkRehype)
      .parse(markdown) as unknown as Root;

    const heading = tree.children.find(
      (node) => node.type === "heading" && node.depth === 1
    ) as Heading;
    if (!heading) return;
    const content = heading.children[0] as Text;
    if (!content) return;
    return content.value;
  };
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
          userDiv.classList.add("p-1", "px-2", "font-normal", "rounded-lg");
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

  const users = partykitProvider.awareness.getStates();
  return (
    <div
      className={partykitProvider.wsconnected ? "connected" : "disconnected"}
    >
      <nav className="max-w-screen-xl px-6 flex items-center justify-between fixed top-0 inset-x-0 mx-auto w-full py-5">
        <Link href="/dashboard" className="flex gap-2 items-center select-none">
          <ChevronLeft size={16} />
          Back
        </Link>
        <div
          className={
            "before:content-[' '] flex items-center gap-4 text-xs before:block before:h-2 before:w-2 before:rounded-full before:bg-stone-300 data-[status='connected']:before:bg-emerald-500 sm:text-base"
          }
          data-status={connectionStatus}
        >
          <span className="overflow-ellipsis whitespace-nowrap group">
            {connectionStatus === "connected"
              ? `${users.size} user${users.size === 1 ? "" : "s"} online`
              : "offline"}{" "}
            <span className="hidden select-none group-hover:inline">
              in room {partykitProvider.roomname}
            </span>
          </span>
          <div>
            <Button
              onClick={() =>
                navigator.clipboard.writeText(
                  `https://nijika.jcde.xyz/editor/${room}`
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
