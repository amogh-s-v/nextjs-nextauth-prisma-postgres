import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

async function query(data) {
  const response = await fetch(
    "https://api-inference.huggingface.co/models/badmatr11x/roberta-base-emotions-detection-from-text",
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

	const session = await getServerSession(authOptions)
	try {
	  const body = await req.json();
	  const { journal_id, journal_text } = body;
  
	  // Await the query to get the response
	  const response = await query({ inputs: journal_text });
  
	  console.log(journal_text);
	  console.log(JSON.stringify(response));
  
	  let highestScore = -Infinity;
	  let highestEmotionLabel = "";
  
	  response[0].forEach((sentiment) => {
		if (sentiment.score > highestScore) {
		  highestScore = sentiment.score;
		  highestEmotionLabel = sentiment.label;
		}
	  });
  
	  console.log("highestEmotionLabel", highestEmotionLabel);


	  if(session?.user.id){
		const newSentiment = await db.sentiment.create({
			data: {
				sentiment: highestEmotionLabel,
				journal_id: journal_id,
				user_id: session?.user.id
			},
		  });
	  }

	  return NextResponse.json(
		{ topSentiment: highestEmotionLabel, message: "" },
		{ status: 201 }
	  );
	} catch (error) {
	  console.error(error);
	  return NextResponse.json(
		{ error: 'An error occurred' },
		{ status: 500 }
	  );
	}
  }
