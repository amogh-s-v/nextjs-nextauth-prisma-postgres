-- CreateTable
CREATE TABLE "Problem" (
    "problem_id" TEXT NOT NULL,
    "problem" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "Problem_pkey" PRIMARY KEY ("problem_id")
);

-- AddForeignKey
ALTER TABLE "Problem" ADD CONSTRAINT "Problem_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
