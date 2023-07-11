/*
  Warnings:

  - The values [OWNER] on the enum `AccessLevel` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AccessLevel_new" AS ENUM ('VIEWER', 'EDITOR');
ALTER TABLE "Access" ALTER COLUMN "level" TYPE "AccessLevel_new" USING ("level"::text::"AccessLevel_new");
ALTER TYPE "AccessLevel" RENAME TO "AccessLevel_old";
ALTER TYPE "AccessLevel_new" RENAME TO "AccessLevel";
DROP TYPE "AccessLevel_old";
COMMIT;
