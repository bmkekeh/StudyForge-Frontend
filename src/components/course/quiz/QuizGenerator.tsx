type QuizGeneratorProps = {
  questionCount: number;
  difficulty: string;
  generatingQuiz: boolean;

  setQuestionCount: (count: number) => void;
  setDifficulty: (difficulty: string) => void;

  generateQuiz: () => void;
};

function QuizGenerator({
  questionCount,
  difficulty,
  generatingQuiz,
  setQuestionCount,
  setDifficulty,
  generateQuiz,
}: QuizGeneratorProps) {
  return (
    <section className="quiz-generator">
      <h3>Generate Quiz</h3>

      <div className="quiz-generator-controls">
        <div className="quiz-control">
          <label htmlFor="question-count">
            Questions
          </label>

          <select
            id="question-count"
            value={questionCount}
            onChange={(event) =>
              setQuestionCount(
                Number(event.target.value),
              )
            }
          >
            <option value={5}>5 questions</option>
            <option value={10}>10 questions</option>
            <option value={15}>15 questions</option>
            <option value={20}>20 questions</option>
          </select>
        </div>

        <div className="quiz-control">
          <label htmlFor="difficulty">
            Difficulty
          </label>

          <select
            id="difficulty"
            value={difficulty}
            onChange={(event) =>
              setDifficulty(event.target.value)
            }
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        <button
          type="button"
          className="generate-quiz-button"
          onClick={generateQuiz}
          disabled={generatingQuiz}
        >
          {generatingQuiz
            ? "Generating..."
            : "Generate Quiz"}
        </button>
      </div>
    </section>
  );
}

export default QuizGenerator;