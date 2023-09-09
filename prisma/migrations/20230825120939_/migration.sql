/*
  Warnings:

  - Added the required column `public_id` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "File" ADD COLUMN     "public_id" VARCHAR(12) NOT NULL;
