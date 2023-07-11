/*
  Warnings:

  - The values [Viewer,Editor] on the enum `AccessLevel` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AccessLevel_new" AS ENUM ('OWNER', 'VIEWER', 'EDITOR');
ALTER TABLE "Access" ALTER COLUMN "level" TYPE "AccessLevel_new" USING ("level"::text::"AccessLevel_new");
ALTER TYPE "AccessLevel" RENAME TO "AccessLevel_old";
ALTER TYPE "AccessLevel_new" RENAME TO "AccessLevel";
DROP TYPE "AccessLevel_old";
COMMIT;

-- DropEnum
DROP TYPE "Priority";

-- DropEnum
DROP TYPE "Status";
