-- CreateTable
CREATE TABLE "Solution" (
    "solution_id" TEXT NOT NULL,
    "solution_name" TEXT NOT NULL,
    "solution_description" TEXT NOT NULL,
    "problem_id" TEXT NOT NULL,

    CONSTRAINT "Solution_pkey" PRIMARY KEY ("solution_id")
);

-- AddForeignKey
ALTER TABLE "Solution" ADD CONSTRAINT "Solution_problem_id_fkey" FOREIGN KEY ("problem_id") REFERENCES "Problem"("problem_id") ON DELETE RESTRICT ON UPDATE CASCADE;
