import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req) {
  const session = await getServerSession(authOptions);
//   const { user_id } = req.query;

  try {
    const user = await db.user.findUnique({
      where: {
        username: session?.user.username,
      },
      include: {
        sentiment: {
          include: {
            journal: true,
          },
        },
      },
    });

    console.log("USER", user)

    // const { username, sentiment } = user;
    // const formattedSentiments = sentiments.map((sentiment) => ({
    //   sentiment_id: sentiment.sentiment_id,
    //   date: sentiment.journal.date,
    //   sentiments: sentiment.sentiments,
    // }));

    return NextResponse.json(
      { username:"ed", sentimentHistory: "owfien" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error fetching sentiment history:", error);
  }
}
