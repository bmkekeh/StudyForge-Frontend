import type {
  QuizAttempt,
} from "../../../types/course";

type AttemptHistoryProps = {
  quizAttempts: QuizAttempt[];
};

function AttemptHistory({
  quizAttempts,
}: AttemptHistoryProps) {
  const getPercentage = (
    attempt: QuizAttempt,
  ) => {
    if (attempt.totalQuestions === 0) {
      return 0;
    }

    return Math.round(
      (attempt.score /
        attempt.totalQuestions) *
        100,
    );
  };

  const formatAttemptDate = (
    completedAt: string,
  ) => {
    if (!completedAt) {
      return "";
    }

    const date = new Date(completedAt);

    if (
      Number.isNaN(date.getTime())
    ) {
      return completedAt;
    }

    return date.toLocaleString();
  };

  return (
    <section className="attempt-history">
      <div className="attempt-history-header">
        <h3>Attempt History</h3>

        <span className="attempt-count">
          {quizAttempts.length}{" "}
          {quizAttempts.length === 1
            ? "attempt"
            : "attempts"}
        </span>
      </div>

      {quizAttempts.length === 0 ? (
        <div className="course-empty-state">
          <h3>No attempts yet</h3>

          <p>
            Complete a quiz to start
            tracking your performance.
          </p>
        </div>
      ) : (
        <div className="attempt-list">
          {quizAttempts.map(
            (attempt) => (
              <div
                className="attempt-card"
                key={attempt.id}
              >
                <div className="attempt-info">
                  <div className="attempt-score-icon">
                    {attempt.score}/
                    {attempt.totalQuestions}
                  </div>

                  <div>
                    <h4>Quiz Attempt</h4>

                    <p>
                      {formatAttemptDate(
                        attempt.completedAt,
                      )}
                    </p>
                  </div>
                </div>

                <div className="attempt-percentage">
                  {getPercentage(attempt)}%
                </div>
              </div>
            ),
          )}
        </div>
      )}
    </section>
  );
}

export default AttemptHistory;