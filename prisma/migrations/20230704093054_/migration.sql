/*
  Warnings:

  - A unique constraint covering the columns `[wsToken]` on the table `Session` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `wsToken` to the `Session` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "wsToken" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Session_wsToken_key" ON "Session"("wsToken");
