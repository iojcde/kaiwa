"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEditorState } from "@/state/editor";
import { useCallback, useTransition } from "react";
import { debounce } from "lodash";
import type { save } from "./save";

export const EditorNav: React.FC<{ id: string; save: typeof save }> = ({
  id,
  save,
}) => {
  const { saved, title, content, setSaved, isPending, setIsPending } =
    useEditorState();

  const saveFn = useCallback(
    async ({ title, content }: { title: string; content: string }) => {
      setIsPending(true);
      console.log("saving manually");

      const result = await save({
        id,
        title: title,
        content: content,
      });

      setIsPending(false);
      console.log(result);
      setSaved(true);
    },
    []
  );

  return (
    <nav className="max-w-screen-xl px-6 flex items-center justify-between fixed top-0 inset-x-0 mx-auto w-full py-5">
      <Link href="/dashboard" className="flex gap-2 items-center">
        <ChevronLeft size={16} />
        Back
      </Link>
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          onClick={() => saveFn({ title, content: content ?? "" })}
          className="w-24 flex gap-1 items-center bg-primary/90  transition"
          disabled={saved && !isPending}
        >
          {isPending && !saved && (
            <Loader2 className="animate-spin w-5 h-5 text-gray-10" />
          )}
          {isPending ? "Saving" : saved ? "Saved" : "Save"}
        </Button>
      </div>
    </nav>
  );
};
