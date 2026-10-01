import type { Quiz } from "../../../types/course";

type ActiveQuizProps = {
  quiz: Quiz;
  currentQuestionIndex: number;
  selectedAnswer: number | null;
  answerSubmitted: boolean;
  score: number;

  setSelectedAnswer: (answer: number) => void;

  submitAnswer: () => void;
  nextQuestion: () => void;
};

function ActiveQuiz({
  quiz,
  currentQuestionIndex,
  selectedAnswer,
  answerSubmitted,
  score,
  setSelectedAnswer,
  submitAnswer,
  nextQuestion,
}: ActiveQuizProps) {
  const currentQuestion =
    quiz.questions[currentQuestionIndex];

  if (!currentQuestion) {
    return null;
  }

  const progressPercentage =
    ((currentQuestionIndex + 1) /
      quiz.questions.length) *
    100;

  const isCorrect =
    selectedAnswer ===
    currentQuestion.correctAnswer;

  return (
    <section className="quiz">
      <div className="quiz-header">
        <span>
          Question {currentQuestionIndex + 1} of{" "}
          {quiz.questions.length}
        </span>

        <span>Score: {score}</span>
      </div>

      <div className="quiz-progress">
        <div
          className="quiz-progress-bar"
          style={{
            width: `${progressPercentage}%`,
          }}
        />
      </div>

      <h3 className="quiz-question">
        {currentQuestion.question}
      </h3>

      <div className="quiz-options">
        {currentQuestion.options.map(
          (option, index) => {
            let className = "quiz-option";

            if (selectedAnswer === index) {
              className += " selected";
            }

            if (
              answerSubmitted &&
              index ===
                currentQuestion.correctAnswer
            ) {
              className += " correct";
            }

            if (
              answerSubmitted &&
              selectedAnswer === index &&
              index !==
                currentQuestion.correctAnswer
            ) {
              className += " incorrect";
            }

            return (
              <button
                type="button"
                key={index}
                className={className}
                disabled={answerSubmitted}
                onClick={() =>
                  setSelectedAnswer(index)
                }
              >
                {option}
              </button>
            );
          },
        )}
      </div>

      {!answerSubmitted ? (
        <button
          type="button"
          className="generate-quiz-button"
          onClick={submitAnswer}
          disabled={selectedAnswer === null}
        >
          Submit Answer
        </button>
      ) : (
        <div
          className={`quiz-feedback ${
            isCorrect
              ? "feedback-correct"
              : "feedback-incorrect"
          }`}
        >
          <h3>
            {isCorrect
              ? "Correct!"
              : "Incorrect"}
          </h3>

          <p>
            {currentQuestion.explanation}
          </p>

          <button
            type="button"
            onClick={nextQuestion}
          >
            {currentQuestionIndex ===
            quiz.questions.length - 1
              ? "View Results"
              : "Next Question"}
          </button>
        </div>
      )}
    </section>
  );
}

export default ActiveQuiz;