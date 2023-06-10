import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import NextDynamic from "next/dynamic";
import React from "react";
import { save } from "./save";
import { Title } from "./title";
import { Loader2 } from "lucide-react";

const NoSSREditor = NextDynamic(() => import("@/app/editor/[id]/editor"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center mt-48">
      <Loader2 className="animate-spin w-8 h-8 text-gray-9" />
    </div>
  ),
});

const EditorPage = async ({ params: { id } }: { params: { id: string } }) => {
  const post = await db.post.findUnique({ where: { id } });
  const session = await getServerSession(authOptions);

  if (post?.authorId != session?.user.id || !post) {
    return <p>Not your post</p>;
  }

  return (
    <div className="px-6 w-full max-w-screen-md mx-auto mt-8">
      <Title
        save={save}
        id={id}
        defaultTitle={post?.title ?? "Untitled Post"}
      />
      <NoSSREditor content={post?.content ?? ""} save={save} id={id} />
    </div>
  );
};
export default EditorPage;

export const dynamic = "force-dynamic";
