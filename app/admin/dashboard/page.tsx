"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Define the Quiz type
interface Quiz {
  _id: string;
  category: string;
  questions: { question: string; options: string[]; answer: string }[];
}

export default function AdminDashboard() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]); // Use Quiz[] as the state type
  const router = useRouter();

  useEffect(() => {
    // Check if admin is logged in
    const isAuthenticated = localStorage.getItem("admin-authenticated");
    if (!isAuthenticated) {
      router.push("/admin/login"); // Corrected path for login
    }
    fetchQuizzes();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("admin-authenticated");
    router.push("/admin/login"); // Corrected path for login
  };

  const fetchQuizzes = async () => {
    try {
      const response = await fetch("/api/quiz");
      if (response.ok) {
        const data: Quiz[] = await response.json(); // Ensure the fetched data matches the Quiz type
        setQuizzes(data);
      } else {
        console.error("Failed to fetch quizzes");
      }
    } catch (error) {
      console.error("Error fetching quizzes:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch("/api/quiz", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        alert("Quiz deleted successfully");
        fetchQuizzes(); // Refresh the quiz list after deletion
      } else {
        const error = await response.json();
        console.error("Error deleting quiz:", error);
        alert("Failed to delete quiz");
      }
    } catch (error) {
      console.error("Error deleting quiz:", error);
      alert("Something went wrong while deleting the quiz.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>
      <button
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => router.push("/admin/create-quiz")}
      >
        Create Quiz
      </button>

      <button
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-4"
        onClick={handleLogout}
      >
        Logout
      </button>

      <h2 className="text-2xl font-bold mt-8">Quizzes</h2>
      <ul className="mt-4">
        {quizzes.length > 0 ? (
          quizzes.map((quiz) => (
            <li key={quiz._id} className="mb-4 border rounded p-4">
              <h3 className="font-bold">Category: {quiz.category}</h3>
              <p>Questions: {quiz.questions.length}</p>
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded mt-2"
                onClick={() => handleDelete(quiz._id)}
              >
                Delete
              </button>
            </li>
          ))
        ) : (
          <p>No quizzes found</p>
        )}
      </ul>
    </div>
  );
}
