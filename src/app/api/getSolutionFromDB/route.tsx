import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hash } from "bcrypt";
import * as z from "zod";



export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { problem } = body;

    const existingProblem = await db.uniqueProblem.findUnique({
      where: {
        problem: problem
      },
    });

    const existingSolutionFromDB = await db.solution.findFirst({
        where: {
            problem_id: existingProblem?.problem_id
        }
    })

    const existingSolution = {
        exercise_name: existingSolutionFromDB?.solution_name,
        description: existingSolutionFromDB?.solution_description,
    }
    if(existingSolution) {
        return NextResponse.json(
            { solution: existingSolution, message: "Account Created" },
            { status: 201 }
          );
    }
    
  } catch (error) {}
}
