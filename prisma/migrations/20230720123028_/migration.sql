/*
  Warnings:

  - You are about to drop the column `known_user_ids` on the `Account` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Account" DROP COLUMN "known_user_ids";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "knownUserIds" TEXT[];
