import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

async function query(data) {
  const response = await fetch(
    "https://api-inference.huggingface.co/models/alvaroalon2/biobert_diseases_ner",
    {
      headers: {
        Authorization: "Bearer " + process.env.HUGGINGFACE_TOKEN,
      },
      method: "POST",
      body: JSON.stringify(data),
    }
  );
  const result = await response.json();
  return result;
}

async function createUniqueProblem(problem) {
  try {
    // Start a transaction
    const result = await db.$transaction(async (prisma) => {
      const existingProblem = await prisma.uniqueProblem.findUnique({
        where: { problem: problem },
      });

      if (existingProblem) {
        console.log('Problem already exists:', existingProblem);
        return existingProblem; // Return the existing problem
      }

      const newUniqueProblem = await prisma.uniqueProblem.create({
        data: { problem: problem },
      });

      console.log('Problem created:', newUniqueProblem);
      return newUniqueProblem;
    });

    return result;
  } catch (error) {
    if (error.code === 'P2002') {
      console.error('A problem with this description already exists.');
    } else {
      console.error('Error creating problem:', error);
    }
    throw error; // Re-throw the error if you want to handle it further up the call stack
  }
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  try {
    const body = await req.json();
    const { journal_id, journal_text } = body;

    // Await the query to get the response
    const response = await query({
      inputs: journal_text,
      options: {
        wait_for_model: true,
      },
    });

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
      try {
        // Create an array to store the promises
        const problemInsertions = filteredProblems.map(async (problem) => {
          try {
            const newProblem = await db.problem.create({
              data: {
                problem: problem,
                user_id: session?.user.id,
              },
            });

            const data = await createUniqueProblem(problem);

            return {
              problem: data?.problem,
              problem_id: data?.problem_id,
            };
          } catch (error) {
            console.error(`Error inserting problem: ${problem}`, error);
            throw error;
          }
        });

        // Wait for all promises to resolve
        const insertedProblems = await Promise.all(problemInsertions);

        return NextResponse.json(
          {
            problems: insertedProblems,
            message: "Problems inserted successfully",
          },
          { status: 201 }
        );
      } catch (error) {
        console.error("Error inserting problems:", error);
        return NextResponse.json(
          { message: "Error inserting problems", error: "error.message" },
          { status: 500 }
        );
      }
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
