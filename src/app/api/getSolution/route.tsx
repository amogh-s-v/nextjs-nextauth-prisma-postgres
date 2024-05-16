import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  ollama,
  zodSchema,
  generateObject,
  jsonObjectPrompt,
} from "modelfusion";
import { z } from "zod";

export async function POST(req) {
  try {
    const body = await req.json();
    const { problem } = body;

    const solution = await generateObject({
      model: ollama
        .ChatTextGenerator({
          model: "openhermes",
          maxGenerationTokens: 1024,
          temperature: 0,
        })
        .asObjectGenerationModel(jsonObjectPrompt.instruction()),

      schema: zodSchema(
        z.object({
          exercise_name: z
            .string()
            .nonempty()
            .max(255)
            .describe("Exercise name"),
          description: z.string().max(500).describe("Exercise description."),
        })
      ),

      prompt: {
        system:
          "Give me 1 excercise to help alleviate the following problem. Describe the excercise in short",
        instruction: problem,
      },
    });

    console.log("SOL BACKEND", solution);

    return NextResponse.json(
      { solution: solution, message: "" },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
