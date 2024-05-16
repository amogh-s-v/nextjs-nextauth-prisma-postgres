import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req) {
  const session = await getServerSession(authOptions);

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


    const { username, sentiment } = user;

    const formattedSentiments = sentiment.map((sentiment) => {
      console.log("SENTI", sentiment)
      return {
        sentiment_id: sentiment.sentiment_id,
        date: sentiment.journal.date,
        sentiment: sentiment.sentiment,
        journal_text: sentiment.journal.journal_text,
      };
    });

    console.log("FORMAT", formattedSentiments)


    return NextResponse.json(
      { sentimentHistory: formattedSentiments },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error fetching sentiment history:", error);
  }
}
