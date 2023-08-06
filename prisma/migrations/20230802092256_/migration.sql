/*
  Warnings:

  - You are about to drop the column `contentId` on the `Workspace` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[treeId]` on the table `Workspace` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `treeId` to the `Workspace` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Workspace" DROP CONSTRAINT "Workspace_contentId_fkey";

-- DropIndex
DROP INDEX "Workspace_contentId_key";

-- AlterTable
ALTER TABLE "Workspace" DROP COLUMN "contentId",
ADD COLUMN     "treeId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Workspace_treeId_key" ON "Workspace"("treeId");

-- AddForeignKey
ALTER TABLE "Workspace" ADD CONSTRAINT "Workspace_treeId_fkey" FOREIGN KEY ("treeId") REFERENCES "Node"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
