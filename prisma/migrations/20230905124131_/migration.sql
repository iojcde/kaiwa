/*
  Warnings:

  - You are about to alter the column `path` on the `File` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(64)`.
  - You are about to alter the column `filename` on the `File` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(128)`.
  - A unique constraint covering the columns `[vaultId,path,latest]` on the table `File` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "File" ALTER COLUMN "path" SET DATA TYPE VARCHAR(64),
ALTER COLUMN "filename" SET DATA TYPE VARCHAR(128);

-- CreateIndex
CREATE UNIQUE INDEX "File_vaultId_path_latest_key" ON "File"("vaultId", "path", "latest");
