/*
  Warnings:

  - Added the required column `joural_id` to the `Problem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Problem" ADD COLUMN     "joural_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Problem" ADD CONSTRAINT "Problem_joural_id_fkey" FOREIGN KEY ("joural_id") REFERENCES "Journal"("journal_id") ON DELETE RESTRICT ON UPDATE CASCADE;
