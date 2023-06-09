/*
  Warnings:

  - You are about to drop the column `deletedAt` on the `Task` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Task" DROP COLUMN "deletedAt",
ADD COLUMN     "completedAt" TIMESTAMP(3);
