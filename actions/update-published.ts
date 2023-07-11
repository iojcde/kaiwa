"use server";
import { db } from "@/lib/db";

export const updatePublished = async ({ room, published }) => {
  return await db.post.update({ where: { id: room }, data: { published } });
};
