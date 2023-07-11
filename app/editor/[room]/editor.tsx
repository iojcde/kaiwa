"use client";
import { useToast } from "@/components/ui/use-toast";
import { useCollabContext } from "@/context/CollabContext";
import {
  placeholder,
  placeholderCtx,
  placeholderEnabledCtx,
} from "@/milkdown/plugins/placeholder";
import { theme } from "@/milkdown/theme";
import { Editor, editorViewCtx, rootCtx } from "@milkdown/core";
import { clipboard } from "@milkdown/plugin-clipboard";
import { collab, collabServiceCtx } from "@milkdown/plugin-collab";
import { history } from "@milkdown/plugin-history";
import { listener, listenerCtx } from "@milkdown/plugin-listener";
import { commonmark } from "@milkdown/preset-commonmark";
import { gfm } from "@milkdown/preset-gfm";
import { Milkdown, MilkdownProvider, useEditor } from "@milkdown/react";
import { debounce } from "lodash";
import type { Heading, Root, Text } from "mdast";
import { useSession } from "next-auth/react";
import React, { useEffect } from "react";
import rehypeSanitize from "rehype-sanitize";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { stat } from "fs";

const MilkdownEditor: React.FC<{
  room: string;
}> = ({ room }) => {
  const { status, data: session } = useSession();

  const {
    provider: partykitProvider,
    initProvider,
    doc: yDoc,
  } = useCollabContext();

  const { toast } = useToast();
  useEffect(() => {
    return () => {
      partykitProvider.destroy();
    };
  }, [partykitProvider]);

  useEffect(() => {
    status == "authenticated" && initProvider(room, session?.wsToken);

    status == "unauthenticated" && initProvider(room, "www");

    return () => {
      if (partykitProvider.roomname != "offline-room") {
        // console.log("destroying partykit", partykitProvider);
        partykitProvider.destroy();
      }
    };
  }, [status, room]);

  const saveTitle = debounce(async (title) => {
    const res = await fetch("/api/post/title", {
      method: "POST",
      body: JSON.stringify({ title, room }),
    });
    if (!res.ok) {
      // console.log(res);
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
    if (partykitProvider.roomname != "offline-room") {
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

        const view = ctx.get(editorViewCtx);
        view.focus();
      });
    }
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
  room: string;
}> = ({ room }) => {
  return (
    <MilkdownProvider>
      <MilkdownEditor room={room} />
    </MilkdownProvider>
  );
};

export default MilkdownEditorWrapper;
