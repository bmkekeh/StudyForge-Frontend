import type {
  SavedQuiz,
} from "../../../types/course";

type SavedQuizzesProps = {
  savedQuizzes: SavedQuiz[];

  openSavedQuiz: (
    saved: SavedQuiz,
  ) => void;

  deleteSavedQuiz: (
    quizId: number,
  ) => void;
};

function SavedQuizzes({
  savedQuizzes,
  openSavedQuiz,
  deleteSavedQuiz,
}: SavedQuizzesProps) {
  return (
    <section className="saved-quizzes-section">
      <div className="saved-quizzes-header">
        <h3>Saved Quizzes</h3>

        <span className="saved-quizzes-count">
          {savedQuizzes.length}{" "}
          {savedQuizzes.length === 1
            ? "saved quiz"
            : "saved quizzes"}
        </span>
      </div>

      {savedQuizzes.length === 0 ? (
        <div className="course-empty-state">
          <h3>No saved quizzes yet</h3>

          <p>
            Generate a quiz and it will
            appear here.
          </p>
        </div>
      ) : (
        <div className="saved-quiz-list">
          {savedQuizzes.map((saved) => (
            <div
              className="saved-quiz-card"
              key={saved.id}
            >
              <div className="saved-quiz-info">
                <div className="saved-quiz-icon">
                  ?
                </div>

                <div>
                  <h4>{saved.title}</h4>

                  <p>
                    {new Date(
                      saved.createdAt,
                    ).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="saved-quiz-actions">
                <button
                  type="button"
                  className="open-quiz-button"
                  onClick={() =>
                    openSavedQuiz(saved)
                  }
                >
                  Open
                </button>

                <button
                  type="button"
                  className="delete-quiz-button"
                  onClick={() =>
                    deleteSavedQuiz(saved.id)
                  }
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default SavedQuizzes;