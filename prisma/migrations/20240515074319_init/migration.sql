/*
  Warnings:

  - You are about to drop the column `sentiments` on the `Sentiment` table. All the data in the column will be lost.
  - Added the required column `sentiment` to the `Sentiment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Sentiment" DROP COLUMN "sentiments",
ADD COLUMN     "sentiment" TEXT NOT NULL;
