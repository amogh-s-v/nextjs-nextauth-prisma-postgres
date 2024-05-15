import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import axios from "axios";

const API_URL = "https://api-inference.huggingface.co/models/meta-llama/Meta-Llama-3-8B-Instruct"
const headers = {
  Authorization: "Bearer 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",
};

const query = async (payload) => {
  console.log("IN QUERY");
  try {
    const response = await axios.post(API_URL, payload, { headers });
    return response.data;
  } catch (error) {
    console.error("Error querying Gemma API:", error);
    return null;
  }
};

const handleSend = async () => {
  console.log("IN HANDLE SEND");
  const payload = {
    inputs: `
    Provide 1 psychological exercise and 1 physiological exercise, each with its description, to manage arthritis in the format of 'exercise' key and an 'exercise_description' key for each exercise in JSON format.`,
  };
  const response = await query(payload);
  const gemmaResponse = response[0]?.generated_text || "";
  console.log("gemmaResponse", gemmaResponse);
};

export async function POST(req) {
  const session = await getServerSession(authOptions);
  try {
    const body = await req.json();
    const { journal_id, journal_text } = body;
    handleSend();

    // return NextResponse.json(
    //   { problems: [filteredProblems], message: "" },
    //   { status: 201 }
    // );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
