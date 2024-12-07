"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function Result() {
  const searchParams = useSearchParams();
  const name = searchParams.get("name");
  const category = searchParams.get("category");
  const score = searchParams.get("score");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">Quiz Result</h1>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <p className="text-xl mb-4">Name: {name}</p>
        <p className="text-xl mb-4">Category: {category}</p>
        <p className="text-xl mb-4">Score: {score} out of 5</p>
        <Link
          href="/"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Take Another Quiz
        </Link>
      </div>
    </div>
  );
}
