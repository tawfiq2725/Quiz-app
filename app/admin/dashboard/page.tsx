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
      router.push("/admin/login");
    }
    fetchQuizzes();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("admin-authenticated");
    router.push("/admin/login");
  };

  const fetchQuizzes = async () => {
    try {
      const response = await fetch("/api/quiz");
      if (response.ok) {
        const data: Quiz[] = await response.json();
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
        fetchQuizzes();
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

      <div className="flex justify-between mb-6">
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => router.push("/admin/create-quiz")}
        >
          Create Quiz
        </button>

        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      <h2 className="text-2xl font-bold mb-4">Quizzes</h2>

      {quizzes.length > 0 ? (
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2">S.NO</th>
              <th className="border border-gray-300 px-4 py-2">Category</th>
              <th className="border border-gray-300 px-4 py-2">Questions</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {quizzes.map((quiz, index) => (
              <tr key={quiz._id} className="hover:bg-gray-100">
                <td className="border border-gray-300 px-4 py-2">
                  {index + 1}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {quiz.category}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {quiz.questions.length}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded mr-2"
                    onClick={() => router.push(`/admin/edit-quiz/${quiz._id}`)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
                    onClick={() => handleDelete(quiz._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No quizzes found</p>
      )}
    </div>
  );
}
