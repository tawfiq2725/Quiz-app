// /app/api/quiz/questions/route.ts

import { NextResponse } from "next/server";
import Quiz from "@/app/lib/model";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const category = url.searchParams.get("category");

  try {
    const quiz = await Quiz.findOne({ category });
    if (!quiz) {
      return NextResponse.json(
        { error: "No questions found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ questions: quiz.questions });
  } catch (error) {
    console.error("Error fetching questions:", error);
    return NextResponse.json(
      { error: "Failed to fetch questions" },
      { status: 500 }
    );
  }
}
