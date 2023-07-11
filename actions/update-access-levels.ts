"use server";

import { db } from "@/lib/db";
import { AccessLevel } from "@prisma/client";

export const updateAccessLevels = async (
  updateList: Record<string, AccessLevel>
) => { 

  Object.keys(updateList).forEach(async (id) => {
    await db.access.update({
      where: { id },
      data: { level: updateList[id] },
    });
  });
};
