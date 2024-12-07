import mongoose, { Schema, Document } from "mongoose";

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface QuizDocument extends Document {
  category: string;
  questions: Question[];
}

const quizSchema = new Schema<QuizDocument>({
  category: { type: String, required: true },
  questions: [
    {
      question: { type: String, required: true },
      options: { type: [String], required: true },
      correctAnswer: { type: String, required: true },
    },
  ],
});

const Quiz =
  mongoose.models.Quiz || mongoose.model<QuizDocument>("Quiz", quizSchema);

export default Quiz;
