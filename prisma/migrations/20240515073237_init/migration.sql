-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Journal" (
    "journal_id" TEXT NOT NULL,
    "journal_text" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Journal_pkey" PRIMARY KEY ("journal_id")
);

-- CreateTable
CREATE TABLE "Sentiment" (
    "sentiment_id" TEXT NOT NULL,
    "sentiments" TEXT[],
    "user_id" TEXT NOT NULL,
    "journal_id" TEXT NOT NULL,

    CONSTRAINT "Sentiment_pkey" PRIMARY KEY ("sentiment_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "Journal" ADD CONSTRAINT "Journal_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sentiment" ADD CONSTRAINT "Sentiment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sentiment" ADD CONSTRAINT "Sentiment_journal_id_fkey" FOREIGN KEY ("journal_id") REFERENCES "Journal"("journal_id") ON DELETE RESTRICT ON UPDATE CASCADE;
