/*
  Warnings:

  - A unique constraint covering the columns `[segment]` on the table `Workspace` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `segment` to the `Workspace` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Workspace" ADD COLUMN     "segment" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Workspace_segment_key" ON "Workspace"("segment");
