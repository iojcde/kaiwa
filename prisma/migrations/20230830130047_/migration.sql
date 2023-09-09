-- DropIndex
DROP INDEX "vault_public_id_latest";

-- CreateIndex
CREATE INDEX "public_id_latest" ON "File"("public_id", "latest");
