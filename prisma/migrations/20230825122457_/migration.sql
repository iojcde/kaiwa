/*
  Warnings:

  - You are about to drop the column `content` on the `File` table. All the data in the column will be lost.
  - Added the required column `data` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "File" DROP COLUMN "content",
ADD COLUMN     "data" BYTEA NOT NULL,
ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false;
