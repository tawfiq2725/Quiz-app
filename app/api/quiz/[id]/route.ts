import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/app/lib/db";
import Quiz from "@/app/lib/model";

// Ensure DB is connected
connectDb();

type RouteContext = {
  params: {
    id: string;
  };
};

export async function GET(req: NextRequest, context: RouteContext) {
  const { id } = context.params;
  try {
    const quiz = await Quiz.findById(id);
    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }
    return NextResponse.json(quiz, { status: 200 });
  } catch (error) {
    console.error("Error fetching quiz:", error);
    return NextResponse.json(
      { error: "Failed to fetch quiz" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, context: RouteContext) {
  const { id } = context.params;
  try {
    const data = await req.json();
    const updatedQuiz = await Quiz.findByIdAndUpdate(id, data, { new: true });
    if (!updatedQuiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }
    return NextResponse.json(
      { message: "Quiz updated successfully", updatedQuiz },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating quiz:", error);
    return NextResponse.json(
      { error: "Failed to update quiz" },
      { status: 500 }
    );
  }
}
