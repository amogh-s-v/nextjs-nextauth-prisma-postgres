import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req) {
  const session = await getServerSession(authOptions);

  try {
    const problems = await db.problem.findMany({
      where: { user_id: session?.user.id },
      select: {
        problem: true,
        journal: {
          select: {
            date: true,
            journal_text: true,
          },
        },
      },
    });


    const response = problems.map((problem) => ({
        problem: problem.problem,
        date: problem.journal.date,
        journal_text: problem.journal.journal_text,
      }));
  


    return NextResponse.json(
      { problemtHistory: response },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error fetching sentiment history:", error);
  }
}
