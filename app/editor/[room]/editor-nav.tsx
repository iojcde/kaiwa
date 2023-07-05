"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEditorState } from "@/state/collab";
import { useCallback, useTransition } from "react";
import { debounce } from "lodash";
import type { save } from "./save";

export const EditorNav: React.FC = () => {
  return (
    <nav className="max-w-screen-xl px-6 flex items-center justify-between fixed top-0 inset-x-0 mx-auto w-full py-5">
      <Link href="/dashboard" className="flex gap-2 items-center">
        <ChevronLeft size={16} />
        Back
      </Link>

      <span className="overflow-ellipsis whitespace-nowrap">
        {connectionStatus === "connected"
          ? `${users.size} user${users.size === 1 ? "" : "s"} online`
          : "offline"}{" "}
        <span className="hidden md:inline">
          in room {collaborationProvider.roomname}
        </span>
      </span>
    </nav>
  );
};
