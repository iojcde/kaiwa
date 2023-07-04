/*
  Warnings:

  - You are about to drop the column `wsToken` on the `Session` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[wsToken]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `wsToken` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Session_wsToken_key";

-- AlterTable
ALTER TABLE "Session" DROP COLUMN "wsToken";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "wsToken" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_wsToken_key" ON "User"("wsToken");
