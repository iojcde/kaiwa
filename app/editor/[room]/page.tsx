import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import NextDynamic from "next/dynamic";
import React from "react";
import { save } from "./save";
import { Title } from "./title";
import { Loader2 } from "lucide-react";

import YProvider from "y-partykit/provider";
import { Doc } from "yjs";

const NoSSREditor = NextDynamic(() => import("@/app/editor/[room]/editor"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center mt-48">
      <Loader2 className="animate-spin w-8 h-8 text-gray-9" />
    </div>
  ),
});

const EditorPage = async ({
  params: { room },
}: {
  params: { room: string };
}) => {
  const session = await getServerSession(authOptions);

  const doc = new Doc();
  const provider = new YProvider("nijika.iojcde.partykit.dev", room, doc);

  provider;

  return (
    <div className="px-6 w-full max-w-screen-md mx-auto mt-8">
      <NoSSREditor save={save} room={room} />
    </div>
  );
};
export default EditorPage;

export const dynamic = "force-dynamic";
