/* Copyright 2021, Milkdown by Mirone. */
import type { Ctx } from "@milkdown/ctx";
import { editorViewOptionsCtx } from "@milkdown/core";
import clsx from "clsx";

import "@milkdown/prose/view/style/prosemirror.css";
import "@milkdown/prose/tables/style/tables.css";
import "./style.css";

export const theme = (ctx: Ctx): void => {
  ctx.update(editorViewOptionsCtx, (prev) => {
    const prevClass = prev.attributes;

    return {
      ...prev,
      editable: () => true,
      attributes: (state) => {
        const attrs =
          typeof prevClass === "function" ? prevClass(state) : prevClass;

        return {
          ...attrs,
          class: clsx(
            "prose dark:prose-invert h-full pb-80 px-2 -mx-2 prose-gray lg:prose-lg outline-none",
            attrs?.class || "",
            "milkdown-theme-iojcde"
          ),
        };
      },
    };
  });
};
