import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hash } from "bcrypt";
import * as z from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userid } = body;

    const newJournal = await db.journal.create({
      data: {
        journal_text: "",
        user_id: userid,
      },
    });
    console.log("JOURNAL ID OF THE NEW JOURNAL", newJournal.journal_id);
    return NextResponse.json(
      { journal_id: newJournal.journal_id, message: "Account Created" },
      { status: 201 }
    );
  } catch (error) {}
}
