/*
  Warnings:

  - A unique constraint covering the columns `[public_id,latest]` on the table `File` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "File_latest_public_id_idx";

-- CreateIndex
CREATE INDEX "public_id_latest" ON "File"("public_id", "latest");

-- CreateIndex
CREATE UNIQUE INDEX "File_public_id_latest_key" ON "File"("public_id", "latest");
