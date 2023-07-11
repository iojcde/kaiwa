"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { db } from "./db";
import { AccessLevel } from "@prisma/client";

export const checkPostAccess = async ({ room }) => {
  const session = await getServerSession(authOptions);

  if (session == null) {
    return false;
  }
  const post = await db.post.findFirst({
    where: { id: room },
    select: {
      access: { where: { userId: session.user.id, postId: room } },
      authorId: true,
    },
  });
  let level: AccessLevel;

  post.authorId == session.user.id && level == "OWNER";
  if (post.access.length > 0) {
    level = post.access[0].level;
  }

  const hasAccess = post.access.length > 0 || level == "OWNER";

  return { level, hasAccess };
};
