"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CreateQuiz() {
  const [category, setCategory] = useState("");
  const [questions, setQuestions] = useState([
    { question: "", options: ["", "", "", ""], correctAnswer: "" },
  ]);
  const router = useRouter();

  useEffect(() => {
    // Check if the admin is authenticated
    const isAdmin = localStorage.getItem("admin-authenticated");
    if (!isAdmin) {
      router.push("/admin/login");
    }
  }, []);

  const handleQuestionChange = (
    index: number,
    field: "question" | "correctAnswer",
    value: string
  ) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (
    questionIndex: number,
    optionIndex: number,
    value: string
  ) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(newQuestions);
  };

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { question: "", options: ["", "", "", ""], correctAnswer: "" },
    ]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ category, questions }),
      });

      if (response.ok) {
        alert("Quiz created successfully!");
        router.push("/admin/dashboard"); // Redirect to dashboard after successful quiz creation
      } else {
        const error = await response.json();
        console.error("Error creating quiz:", error);
        alert("Failed to create quiz.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Create Quiz</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="category"
          >
            Category
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="category"
            type="text"
            placeholder="Enter quiz category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </div>
        {questions.map((question, index) => (
          <div key={index} className="mb-6 p-4 border rounded">
            <h2 className="text-xl font-bold mb-2">Question {index + 1}</h2>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor={`question-${index}`}
              >
                Question
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id={`question-${index}`}
                type="text"
                placeholder="Enter question"
                value={question.question}
                onChange={(e) =>
                  handleQuestionChange(index, "question", e.target.value)
                }
                required
              />
            </div>
            {question.options.map((option, optionIndex) => (
              <div key={optionIndex} className="mb-2">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor={`question-${index}-option-${optionIndex}`}
                >
                  Option {optionIndex + 1}
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id={`question-${index}-option-${optionIndex}`}
                  type="text"
                  placeholder={`Enter option ${optionIndex + 1}`}
                  value={option}
                  onChange={(e) =>
                    handleOptionChange(index, optionIndex, e.target.value)
                  }
                  required
                />
              </div>
            ))}
            <div className="mb-2">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor={`question-${index}-correct`}
              >
                Correct Answer
              </label>
              <select
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id={`question-${index}-correct`}
                value={question.correctAnswer}
                onChange={(e) =>
                  handleQuestionChange(index, "correctAnswer", e.target.value)
                }
                required
              >
                <option value="">Select correct answer</option>
                {question.options.map((option, optionIndex) => (
                  <option key={optionIndex} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
        <div className="mb-4">
          <button
            type="button"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={handleAddQuestion}
          >
            Add Question
          </button>
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Create Quiz
          </button>
        </div>
      </form>
    </div>
  );
}
