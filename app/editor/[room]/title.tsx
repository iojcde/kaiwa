"use client";

import { useEditorState } from "@/state/collab";
import { debounce } from "lodash";
import { useCallback, useEffect, useTransition } from "react";
import type { save } from "./save";

export const Title: React.FC<{
  defaultTitle: string;
  id: string;
  save: typeof save;
}> = ({ defaultTitle, id, save }) => {
  const { setTitle, title, setSaved, setIsPending, isPending } =
    useEditorState();

  const saveFn = useCallback(
    debounce(async ({ title }: { title: string }) => {
      setSaved(false);
      setIsPending(true);
      console.log("saving title automatically");

      const result = await save({
        id,
        title,
      });

      setIsPending(false);
      console.log(result);
      setSaved(true);
    }, 1000),
    []
  );

  useEffect(() => {
    setTitle(defaultTitle);
  }, []);

  return (
    <input
      onChange={(e) => {
        setSaved(false);
        setTitle(e.target.value);
        saveFn({ title });
      }}
      value={title ?? "Untitled Post"}
      className="border-none outline-none mt-12 z-20 mb-4 relative ring-0 text-4xl sm:text-5xl xl:text-6xl tracking-tight font-bold overflow-visible w-full"
    />
  );
};
