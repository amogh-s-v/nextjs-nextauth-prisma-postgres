import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

async function query(data) {
  const response = await fetch(
    "https://api-inference.huggingface.co/models/alvaroalon2/biobert_diseases_ner",
    {
      headers: {
        Authorization: "Bearer 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",
      },
      method: "POST",
      body: JSON.stringify(data),
    }
  );
  const result = await response.json();
  return result;
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  try {
    const body = await req.json();
    const { journal_id, journal_text } = body;

    // Await the query to get the response
    const response = await query({ inputs: journal_text });

    const filterEntities = (response) => {
      const seenEntities = new Set();
      const filteredResponse = [];

      response.forEach((item) => {
        if (item.entity_group !== "0" && !seenEntities.has(item.word)) {
          filteredResponse.push(item.word);
          seenEntities.add(item.word);
        }
      });

      return filteredResponse;
    };

    // Get the filtered response
    const filteredProblems = filterEntities(response);


    if (session?.user.id) {
      filteredProblems.forEach(async (problem) => {
        try {
          const newProblem = await db.problem.create({
            data: {
              problem: problem,
              user_id: session?.user.id,
            },
          });
          console.log(
            `Problem with ID ${newProblem.problem_id} inserted into the database.`
          );
        } catch (error) {
          console.error(`Error inserting problem: ${problem}`, error);
        }
      });
    }

    return NextResponse.json(
      { problems: [filteredProblems], message: "" },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
