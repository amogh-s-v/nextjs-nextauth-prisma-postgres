import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hash } from "bcrypt";
import * as z from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { journal_id, journal_text } = body;

    const editJournal = await db.journal.update({
      where: {
        journal_id: journal_id
      },
      data: {
        journal_text: journal_text
      }
    });
    return NextResponse.json(
      { editJournal: editJournal, message: "Account Created" },
      { status: 201 }
    );
  } catch (error) {}
}
