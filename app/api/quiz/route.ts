import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/app/lib/db";
import Quiz from "@/app/lib/model";

// Ensure DB is connected when this file is loaded
connectDb().catch((err) => console.error("Initial DB connection failed:", err));

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const newQuiz = new Quiz({
      category: data.category,
      questions: data.questions,
    });

    await newQuiz.save();

    return NextResponse.json(
      { message: "Quiz created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving quiz:", error);
    return NextResponse.json(
      { error: "Failed to create quiz" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const quizzes = await Quiz.find();
    return NextResponse.json(quizzes, { status: 200 });
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    return NextResponse.json(
      { error: "Failed to fetch quizzes" },
      { status: 500 }
    );
  }
}
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    const result = await Quiz.findByIdAndDelete(id);
    if (!result) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Quiz deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting quiz:", error);
    return NextResponse.json(
      { error: "Failed to delete quiz" },
      { status: 500 }
    );
  }
}
