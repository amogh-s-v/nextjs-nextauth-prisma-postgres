/*
  Warnings:

  - The primary key for the `Problem` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `problem_id` on the `Problem` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[problem]` on the table `Problem` will be added. If there are existing duplicate values, this will fail.
  - The required column `problem_history_id` was added to the `Problem` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "Solution" DROP CONSTRAINT "Solution_problem_id_fkey";

-- AlterTable
ALTER TABLE "Problem" DROP CONSTRAINT "Problem_pkey",
DROP COLUMN "problem_id",
ADD COLUMN     "problem_history_id" TEXT NOT NULL,
ADD CONSTRAINT "Problem_pkey" PRIMARY KEY ("problem_history_id");

-- CreateTable
CREATE TABLE "UniqueProblem" (
    "problem_id" TEXT NOT NULL,
    "problem" TEXT NOT NULL,

    CONSTRAINT "UniqueProblem_pkey" PRIMARY KEY ("problem_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UniqueProblem_problem_key" ON "UniqueProblem"("problem");

-- CreateIndex
CREATE UNIQUE INDEX "Problem_problem_key" ON "Problem"("problem");

-- AddForeignKey
ALTER TABLE "Solution" ADD CONSTRAINT "Solution_problem_id_fkey" FOREIGN KEY ("problem_id") REFERENCES "UniqueProblem"("problem_id") ON DELETE RESTRICT ON UPDATE CASCADE;
