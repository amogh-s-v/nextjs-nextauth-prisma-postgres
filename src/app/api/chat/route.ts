import { ModelFusionTextStream, asChatMessages } from "@modelfusion/vercel-ai";
import { Message, StreamingTextResponse } from "ai";
// import { ollama, streamText } from "modelfusion";
import {
  ollama,
  zodSchema,
  generateObject,
  jsonObjectPrompt,
} from "modelfusion";
import { z } from "zod";

export const runtime = "edge";

export async function POST(req: Request) {
  const { messages }: { messages: Message[] } = await req.json();
  console.log("MESSAGES", messages);

  // Use ModelFusion to call Ollama:
  const emotion = await generateObject({
    model: ollama
      .ChatTextGenerator({
        model: "openhermes",
        maxGenerationTokens: 1024,
        temperature: 0,
      })
      .asObjectGenerationModel(jsonObjectPrompt.instruction()),

    schema: zodSchema(
      z.object({
        exercise_name: z.string().nonempty().max(255).describe("Exercise name in snake case"),
        description: z.string().max(500).describe("Exercise description.")
      })
    ),

    prompt: {
      system: "Give me 1 excercise to help alleviate the following problem. Please give specific or niche solutions. Make sure excercise name is in snake case",
      instruction: "headache",
    },
  });

  console.log("emotion", emotion)

  // Return the result using the Vercel AI SDK:
  return new StreamingTextResponse(
    ModelFusionTextStream(
      sentiment,
      // optional callbacks:
      {
        onStart() {
          console.log("onStart");
        },
        onToken(token) {
          console.log("onToken", token);
        },
        onCompletion: () => {
          console.log("onCompletion");
        },
        onFinal(completion) {
          console.log("onFinal", completion);
        },
      }
    )
  );
}
