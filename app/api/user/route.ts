// API route to get categories
import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/app/lib/db";
import Quiz from "@/app/lib/model";

// Ensure DB is connected when this file is loaded
connectDb().catch((err) => console.error("Initial DB connection failed:", err));

export async function GET(req: NextRequest) {
  try {
    // Fetch distinct categories from the Quiz model
    const categories = await Quiz.distinct("category");

    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
