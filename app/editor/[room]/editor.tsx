"use client";
import type { Heading, Root, Text } from "mdast";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
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
import { listener, listenerCtx } from "@milkdown/plugin-listener";
import { unified } from "unified";
import remarkParse from "remark-parse";
import { debounce } from "lodash";
import rehypeSanitize from "rehype-sanitize";
import remarkRehype from "remark-rehype";
import { Button } from "@/components/ui/button";
import { useCollabContext, yDoc } from "@/context/CollabContext";
import { useToast } from "@/components/ui/use-toast";

const MilkdownEditor: React.FC<{
  save: typeof save;
  room: string;
}> = ({ room, save }) => {
  const { status, data: session } = useSession();

  const { provider: partykitProvider, initProvider } = useCollabContext();

  const { toast } = useToast();
  useEffect(() => {
    return () => {
      partykitProvider.destroy();
    };
  }, [partykitProvider]);

  useEffect(() => {
    status == "authenticated" && initProvider(room, session?.wsToken);
    return () => {
      console.log("destroying partykit");
      partykitProvider.destroy();
      yDoc.destroy();
    };
  }, [status]);

  const saveTitle = debounce(async (title) => {
    const res = await fetch("/api/post/title", {
      method: "POST",
      body: JSON.stringify({ title, room }),
    });
    if (!res.ok) {
      console.log(res);
    } else {
      toast({ title: "hi", description: "saved title" });
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
            if ((await getTitle(markdown)) != (await getTitle(prevMarkdown))) {
              const title = await getTitle(markdown);
              document.title = title;
              saveTitle(title);
            }
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
      .bindDoc(yDoc)
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
    <MilkdownProvider>
      <MilkdownEditor save={save} room={room} />
    </MilkdownProvider>
  );
};

export default MilkdownEditorWrapper;
