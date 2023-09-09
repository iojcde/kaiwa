-- DropForeignKey
ALTER TABLE "Vault" DROP CONSTRAINT "Vault_githubRepoId_fkey";

-- AlterTable
ALTER TABLE "Vault" ALTER COLUMN "githubRepoId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Vault" ADD CONSTRAINT "Vault_githubRepoId_fkey" FOREIGN KEY ("githubRepoId") REFERENCES "GithubRepo"("id") ON DELETE SET NULL ON UPDATE CASCADE;
