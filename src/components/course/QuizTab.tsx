import {
  useEffect,
  useState,
} from "react";

import type {
  Quiz,
  SavedQuiz,
  QuizAttempt,
  QuizMistake,
  GeneratedQuizResponse,
} from "../../types/course";

import QuizGenerator from "./quiz/QuizGenerator";
import ActiveQuiz from "./quiz/ActiveQuiz";
import QuizResults from "./quiz/QuizResults";
import SavedQuizzes from "./quiz/SavedQuizzes";
import AttemptHistory from "./quiz/AttemptHistory";

type QuizTabProps = {
  courseId: number;
  practiceQuiz:
    GeneratedQuizResponse | null;
};

function QuizTab({
  courseId,
  practiceQuiz,
}: QuizTabProps) {
  /* =========================
     QUIZ DATA
  ========================= */

  const [quiz, setQuiz] =
    useState<Quiz | null>(
      practiceQuiz?.quiz ?? null,
    );

  const [
    currentQuizId,
    setCurrentQuizId,
  ] = useState<number | null>(
    practiceQuiz?.quizId ?? null,
  );

  const [
    savedQuizzes,
    setSavedQuizzes,
  ] = useState<SavedQuiz[]>([]);

  const [
    quizAttempts,
    setQuizAttempts,
  ] = useState<QuizAttempt[]>([]);

  /* =========================
     GENERATOR
  ========================= */

  const [
    questionCount,
    setQuestionCount,
  ] = useState(5);

  const [
    difficulty,
    setDifficulty,
  ] = useState("medium");

  const [
    generatingQuiz,
    setGeneratingQuiz,
  ] = useState(false);

  /* =========================
     QUIZ PROGRESS
  ========================= */

  const [
    currentQuestionIndex,
    setCurrentQuestionIndex,
  ] = useState(0);

  const [
    selectedAnswer,
    setSelectedAnswer,
  ] = useState<number | null>(
    null,
  );

  const [
    answerSubmitted,
    setAnswerSubmitted,
  ] = useState(false);

  const [score, setScore] =
    useState(0);

  const [
    mistakes,
    setMistakes,
  ] = useState<QuizMistake[]>(
    [],
  );

  const [
    quizFinished,
    setQuizFinished,
  ] = useState(false);

  /* =========================
     MESSAGES
  ========================= */

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  /* =========================
     INITIAL LOAD
  ========================= */

  useEffect(() => {
    if (!courseId) {
      return;
    }

    async function load() {
      try {
        const [
          quizzesResponse,
          attemptsResponse,
        ] = await Promise.all([
          fetch(
            `http://localhost:8080/courses/${courseId}/quiz`,
          ),
          fetch(
            `http://localhost:8080/courses/${courseId}/quiz-attempts`,
          ),
        ]);

        if (!quizzesResponse.ok) {
          throw new Error(
            "Failed to load saved quizzes.",
          );
        }

        if (!attemptsResponse.ok) {
          throw new Error(
            "Failed to load quiz attempts.",
          );
        }

        const savedQuizData:
          SavedQuiz[] =
          await quizzesResponse.json();

        const attemptData:
          QuizAttempt[] =
          await attemptsResponse.json();

        setSavedQuizzes(
          savedQuizData,
        );

        setQuizAttempts(
          attemptData,
        );
      } catch (err) {
        console.error(err);

        setError(
          "Could not load quiz data.",
        );
      }
    }

    void load();
  }, [courseId]);

  /* =========================
     LOAD ATTEMPTS
  ========================= */

  const loadQuizAttempts =
    async () => {
      try {
        const response =
          await fetch(
            `http://localhost:8080/courses/${courseId}/quiz-attempts`,
          );

        if (!response.ok) {
          throw new Error(
            "Failed to load quiz attempts.",
          );
        }

        const data:
          QuizAttempt[] =
          await response.json();

        setQuizAttempts(data);
      } catch (err) {
        console.error(err);
      }
    };

  /* =========================
     RESET
  ========================= */

  const resetQuizProgress =
    () => {
      setCurrentQuestionIndex(
        0,
      );

      setSelectedAnswer(null);

      setAnswerSubmitted(
        false,
      );

      setScore(0);

      setMistakes([]);

      setQuizFinished(false);
    };

  /* =========================
     GENERATE QUIZ
  ========================= */

  const generateQuiz =
    async () => {
      setGeneratingQuiz(true);

      setError("");
      setMessage("");
      setCurrentQuizId(null);

      try {
        const response =
          await fetch(
            `http://localhost:8080/courses/${courseId}/quiz/generate?questionCount=${questionCount}&difficulty=${difficulty}`,
            {
              method: "POST",
            },
          );

        if (!response.ok) {
          const text =
            await response.text();

          throw new Error(
            text ||
              "Failed to generate quiz.",
          );
        }

        const data: Quiz =
          await response.json();

        setQuiz(data);

        resetQuizProgress();

        /*
         * Reload saved quizzes so
         * we can determine the ID
         * of the newly generated
         * quiz.
         */
        const savedResponse =
          await fetch(
            `http://localhost:8080/courses/${courseId}/quiz`,
          );

        if (
          !savedResponse.ok
        ) {
          throw new Error(
            "Quiz generated, but its saved record could not be loaded.",
          );
        }

        const savedData:
          SavedQuiz[] =
          await savedResponse.json();

        setSavedQuizzes(
          savedData,
        );

        if (
          savedData.length > 0
        ) {
          const newestQuiz =
            savedData.reduce(
              (
                newest,
                current,
              ) =>
                current.id >
                newest.id
                  ? current
                  : newest,
            );

          setCurrentQuizId(
            newestQuiz.id,
          );
        }

        setMessage(
          "Quiz generated successfully.",
        );
      } catch (err) {
        console.error(err);

        setError(
          err instanceof Error
            ? err.message
            : "Could not generate quiz.",
        );
      } finally {
        setGeneratingQuiz(
          false,
        );
      }
    };

  /* =========================
     OPEN SAVED QUIZ
  ========================= */

  const openSavedQuiz = (
    saved: SavedQuiz,
  ) => {
    try {
      const parsed =
        JSON.parse(
          saved.content,
        ) as Quiz;

      setQuiz(parsed);

      setCurrentQuizId(
        saved.id,
      );

      resetQuizProgress();

      setError("");
      setMessage("");
    } catch (err) {
      console.error(err);

      setError(
        "Could not open this saved quiz.",
      );
    }
  };

  /* =========================
     DELETE SAVED QUIZ
  ========================= */

  const deleteSavedQuiz =
    async (
      quizId: number,
    ) => {
      const confirmed =
        window.confirm(
          "Delete this saved quiz?",
        );

      if (!confirmed) {
        return;
      }

      try {
        const response =
          await fetch(
            `http://localhost:8080/courses/${courseId}/quiz/${quizId}`,
            {
              method:
                "DELETE",
            },
          );

        if (!response.ok) {
          throw new Error(
            "Failed to delete quiz.",
          );
        }

        setSavedQuizzes(
          (current) =>
            current.filter(
              (saved) =>
                saved.id !==
                quizId,
            ),
        );

        if (
          currentQuizId ===
          quizId
        ) {
          setQuiz(null);

          setCurrentQuizId(
            null,
          );

          resetQuizProgress();
        }

        await loadQuizAttempts();

        setMessage(
          "Saved quiz deleted.",
        );
      } catch (err) {
        console.error(err);

        setError(
          err instanceof Error
            ? err.message
            : "Could not delete the quiz.",
        );
      }
    };

  /* =========================
     SUBMIT ANSWER
  ========================= */

  const submitAnswer = () => {
    if (
      selectedAnswer === null ||
      !quiz ||
      answerSubmitted
    ) {
      return;
    }

    const currentQuestion =
      quiz.questions[
        currentQuestionIndex
      ];

    const isCorrect =
      selectedAnswer ===
      currentQuestion
        .correctAnswer;

    if (isCorrect) {
      setScore(
        (current) =>
          current + 1,
      );
    } else {
      /*
       * Store both the topic and
       * question so the backend
       * can later determine which
       * topics the student struggles
       * with most often.
       */
      setMistakes(
        (current) => [
          ...current,
          {
            topic:
              currentQuestion
                .topic,

            question:
              currentQuestion
                .question,
          },
        ],
      );
    }

    setAnswerSubmitted(true);
  };

  /* =========================
     SAVE ATTEMPT
  ========================= */

  const saveQuizAttempt =
    async (
      finalScore: number,
    ) => {
      if (!quiz) {
        return;
      }

      if (
        currentQuizId === null
      ) {
        throw new Error(
          "The quiz ID is missing, so this attempt cannot be saved.",
        );
      }

      console.log(
        "Saving quiz attempt:",
        {
          courseId,

          quizId:
            currentQuizId,

          score:
            finalScore,

          totalQuestions:
            quiz.questions
              .length,

          mistakes,
        },
      );

      const response =
        await fetch(
          `http://localhost:8080/courses/${courseId}/quiz-attempts`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                quizId:
                  currentQuizId,

                score:
                  finalScore,

                totalQuestions:
                  quiz.questions
                    .length,

                mistakes:
                  mistakes,
              }),
          },
        );

      if (!response.ok) {
        const text =
          await response.text();

        throw new Error(
          text ||
            "Failed to save quiz attempt.",
        );
      }

      await loadQuizAttempts();
    };

  /* =========================
     NEXT QUESTION
  ========================= */

  const nextQuestion =
    async () => {
      if (!quiz) {
        return;
      }

      if (
        currentQuestionIndex <
        quiz.questions.length -
          1
      ) {
        setCurrentQuestionIndex(
          (current) =>
            current + 1,
        );

        setSelectedAnswer(
          null,
        );

        setAnswerSubmitted(
          false,
        );

        return;
      }

      /*
       * The answer has already
       * been submitted before
       * Next is used.
       */
      const finalScore =
        score;

      setQuizFinished(true);

      try {
        await saveQuizAttempt(
          finalScore,
        );

        setMessage(
          "Quiz completed and attempt saved.",
        );
      } catch (err) {
        console.error(err);

        setError(
          err instanceof Error
            ? err.message
            : "Quiz completed, but the attempt could not be saved.",
        );
      }
    };

  /* =========================
     RESTART
  ========================= */

  const restartQuiz = () => {
    resetQuizProgress();

    setError("");
    setMessage("");
  };

  /* =========================
     RENDER
  ========================= */

  return (
    <div className="quiz-tab">

      <div className="quiz-tab-header">

        <h2>
          Quizzes
        </h2>

        <p>
          Generate quizzes from
          your uploaded course
          material and track your
          performance.
        </p>

      </div>

      {error && (
        <div className="course-message error">
          {error}
        </div>
      )}

      {message && (
        <div className="course-message">
          {message}
        </div>
      )}

      <QuizGenerator
        questionCount={
          questionCount
        }
        difficulty={
          difficulty
        }
        generatingQuiz={
          generatingQuiz
        }
        setQuestionCount={
          setQuestionCount
        }
        setDifficulty={
          setDifficulty
        }
        generateQuiz={
          generateQuiz
        }
      />

      {quiz &&
        !quizFinished && (
          <ActiveQuiz
            quiz={quiz}
            currentQuestionIndex={
              currentQuestionIndex
            }
            selectedAnswer={
              selectedAnswer
            }
            answerSubmitted={
              answerSubmitted
            }
            score={score}
            setSelectedAnswer={
              setSelectedAnswer
            }
            submitAnswer={
              submitAnswer
            }
            nextQuestion={
              nextQuestion
            }
          />
        )}

      {quiz &&
        quizFinished && (
          <QuizResults
            score={score}
            totalQuestions={
              quiz.questions
                .length
            }
            restartQuiz={
              restartQuiz
            }
          />
        )}

      <SavedQuizzes
        savedQuizzes={
          savedQuizzes
        }
        openSavedQuiz={
          openSavedQuiz
        }
        deleteSavedQuiz={
          deleteSavedQuiz
        }
      />

      <AttemptHistory
        quizAttempts={
          quizAttempts
        }
      />

    </div>
  );
}

export default QuizTab;
