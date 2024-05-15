import { ModelFusionTextStream, asChatMessages } from "@modelfusion/vercel-ai";
import { Message, StreamingTextResponse } from "ai";
// import { ollama, streamText } from "modelfusion";
import { ollama, zodSchema, generateObject, jsonObjectPrompt } from "modelfusion";
import { z } from "zod";

export const runtime = "edge";

export async function POST(req: Request) {
  const { messages }: { messages: Message[] } = await req.json();
  console.log("MESSAGES", messages)

  // Use ModelFusion to call Ollama:
  const emotion = await generateObject({
    model: ollama
      .ChatTextGenerator({
        model: "llama2",
        maxGenerationTokens: 1024,
        temperature: 0,
      })
      .asObjectGenerationModel(jsonObjectPrompt.instruction()),
  
      schema: zodSchema(
        z.object({
          emotion: z.object({
            Gratitude: z.number().min(0).max(1),
            Anger: z.number().min(0).max(1),
            Frustration: z.number().min(0).max(1),
          }).strict().nonstrict().describe("Emotion scores."),
        })
      ),
  
    prompt: {
      system:
        "You are a emotion evaluator. " +
        "Analyze the emotion of the following journal entry:",
      instruction:
        "Today was a struggle as arthritis continued to flare up, making even the simplest tasks feel like monumental challenges. Grateful for supportive friends and family who offered understanding and assistance throughout the day.",
    },
  });

  console.log("SENTI", emotion)

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

