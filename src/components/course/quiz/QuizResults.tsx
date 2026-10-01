type QuizResultsProps = {
  score: number;
  totalQuestions: number;
  restartQuiz: () => void;
};

function QuizResults({
  score,
  totalQuestions,
  restartQuiz,
}: QuizResultsProps) {
  const percentage =
    totalQuestions === 0
      ? 0
      : Math.round(
          (score / totalQuestions) * 100,
        );

  return (
    <section className="quiz-results">
      <h3>Quiz Complete</h3>

      <p>
        You answered {score} out of{" "}
        {totalQuestions} questions correctly.
      </p>

      <p>{percentage}%</p>

      <button
        type="button"
        onClick={restartQuiz}
      >
        Try Again
      </button>
    </section>
  );
}

export default QuizResults;