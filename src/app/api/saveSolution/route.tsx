import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hash } from "bcrypt";
import * as z from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { exercise_name, description, problem_id } = body;

    const newSolution = await db.solution.create({
      data: {
        solution_name: exercise_name,
        solution_description: description,
        problem_id: problem_id
      },
    });
    return NextResponse.json(
      { newSolution: newSolution, message: "Account Created" },
      { status: 201 }
    );
  } catch (error) {}
}
