"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Question = {
  question: string;
  options: string[];
  correctAnswer: string;
};

export default function Quiz() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const name = searchParams.get("name");
  const category = searchParams.get("category");

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(90);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(`/api/u-quiz?category=${category}`);
        const data = await response.json();
        if (data.questions) {
          setQuestions(data.questions);
        } else {
          console.error("No questions found");
        }
      } catch (error) {
        console.error("Failed to fetch questions:", error);
      }
    };
    fetchQuestions();
  }, [category]);

  useEffect(() => {
    const quizDuration = 90;
    const startTimeKey = `quiz_start_time_${category}`;

    let startTime = parseInt(localStorage.getItem(startTimeKey) || "0", 10);
    if (!startTime) {
      startTime = Math.floor(Date.now() / 1000);
      localStorage.setItem(startTimeKey, startTime.toString());
    }

    const updateTimer = () => {
      const elapsedTime = Math.floor(Date.now() / 1000) - startTime;
      const remainingTime = quizDuration - elapsedTime;
      if (remainingTime > 0) {
        setTimeLeft(remainingTime);
      } else {
        clearInterval(timer);
        endQuiz();
      }
    };

    const timer = setInterval(updateTimer, 1000);
    updateTimer();

    return () => clearInterval(timer);
  }, [category]);

  const handleAnswer = (answer: string) => {
    // Ensure userAnswers is updated at the correct index
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestion] = answer; // Store answer at the correct index
    setUserAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      endQuiz(newAnswers); // Pass updated answers to endQuiz
    }
  };

  const endQuiz = (finalAnswers = userAnswers) => {
    // Calculate the score
    const score = questions.reduce((total, question, index) => {
      return total + (finalAnswers[index] === question.correctAnswer ? 1 : 0);
    }, 0);

    // Clear the stored timer key
    const startTimeKey = `quiz_start_time_${category}`;
    localStorage.removeItem(startTimeKey);

    // Redirect to the result page with correct score
    router.push(
      `/result?name=${encodeURIComponent(
        name || ""
      )}&category=${encodeURIComponent(category || "")}&score=${score}`
    );
  };

  if (questions.length === 0) {
    return <p>Loading questions...</p>;
  }

  const currentQ = questions[currentQuestion];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Quiz: {category}</h1>
      <p className="text-xl mb-8">Welcome, {name}!</p>
      <p className="text-lg mb-4">Time left: {timeLeft} seconds</p>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          Question {currentQuestion + 1} of {questions.length}
        </h2>
        {currentQ && (
          <>
            <p className="mb-4">{currentQ.question}</p>
            <div className="space-y-2">
              {currentQ.options.map((option, index) => (
                <button
                  key={index}
                  className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  onClick={() => handleAnswer(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
