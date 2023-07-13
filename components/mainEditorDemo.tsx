"use client";

import {
  Editor,
  defaultValueCtx,
  editorViewCtx,
  rootCtx,
} from "@milkdown/core";
import { Milkdown, MilkdownProvider, useEditor } from "@milkdown/react";

import { theme } from "@/milkdown/theme";
import { clipboard } from "@milkdown/plugin-clipboard";
import { history } from "@milkdown/plugin-history";
import { commonmark } from "@milkdown/preset-commonmark";
import { gfm } from "@milkdown/preset-gfm";

import { placeholder } from "@/milkdown/plugins/placeholder";
import { introContent } from "./intro-content";

const MilkdownEditor = () => {
  const { get } = useEditor((root) =>
    Editor.make()
      .config((ctx) => ctx.set(rootCtx, root as Node))
      .config((ctx) => ctx.set(defaultValueCtx, introContent))
      .config(theme)
      .use(commonmark)
      .use(gfm)
      .use(clipboard)
      .use(placeholder)
      .use(history)
  );

  get()?.config((ctx) => {
    const view = ctx.get(editorViewCtx);

    view.setProps({
      attributes: () => {
        return {
          spellcheck: "false",
        };
      },
    });
  });

  return (
    <div className="px-6 py-2 prose prose-sm  ">
      <Milkdown />
    </div>
  );
};

export const MainEditorDemo = () => (
  <MilkdownProvider>
    <MilkdownEditor />
  </MilkdownProvider>
);
