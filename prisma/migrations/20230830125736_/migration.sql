/*
  Warnings:

  - A unique constraint covering the columns `[vaultId,public_id,latest]` on the table `File` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "File_public_id_latest_key";

-- DropIndex
DROP INDEX "public_id_latest";

-- CreateIndex
CREATE INDEX "vault_public_id_latest" ON "File"("vaultId", "public_id", "latest");

-- CreateIndex
CREATE UNIQUE INDEX "File_vaultId_public_id_latest_key" ON "File"("vaultId", "public_id", "latest");
