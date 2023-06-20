import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { Loader2, PlusIcon } from "lucide-react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { PostCard } from "./post-card";
import { authOptions } from "@/lib/auth";
import { Posts } from "./posts";
import { Suspense } from "react";

const Dashboard = async () => {
  const session = await getServerSession(authOptions);

  const newPost = async () => {
    "use server";
    if (session?.user.id === undefined) throw new Error("No user id");

    const post = await db.post.create({
      data: { title: "Untitled Post", content: "", authorId: session?.user.id },
    });
    redirect(`/editor/${post.id}`);
  };

  return (
    <div className="w-full">
      <div className="flex justify-between w-full items-center">
        <h1 className="text-4xl font-bold tracking-tight">Posts</h1>
        <form action={newPost}>
          <Button type="submit" className="flex items-center gap-2">
            <PlusIcon /> New Post
          </Button>
        </form>
      </div>
      <Suspense fallback={<Loader2 className="w-8 h-8 animate-spin" />}>
        <Posts />
      </Suspense>
    </div>
  );
};

export default Dashboard;

export const dynamic = "force-dynamic";
