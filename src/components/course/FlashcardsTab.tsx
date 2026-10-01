import { useEffect, useState } from "react";

import type {
  FlashcardSet,
  SavedFlashcardSet,
} from "../../types/course";

type FlashcardsTabProps = {
  courseId: number;
  materialCount: number;
};

function FlashcardsTab({
  courseId,
  materialCount,
}: FlashcardsTabProps) {
  const [flashcards, setFlashcards] =
    useState<FlashcardSet | null>(null);

  const [savedFlashcards, setSavedFlashcards] =
    useState<SavedFlashcardSet[]>([]);

  const [flashcardCount, setFlashcardCount] =
    useState(5);

  const [generatingFlashcards, setGeneratingFlashcards] =
    useState(false);

  const [currentFlashcardIndex, setCurrentFlashcardIndex] =
    useState(0);

  const [flashcardFlipped, setFlashcardFlipped] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  /* =========================
     LOAD SAVED FLASHCARDS
  ========================= */

  useEffect(() => {
    if (!courseId) {
      return;
    }

    loadSavedFlashcards();
  }, [courseId]);

  const loadSavedFlashcards = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/courses/${courseId}/flashcards`,
      );

      if (!response.ok) {
        throw new Error(
          "Failed to load flashcards.",
        );
      }

      const data: SavedFlashcardSet[] =
        await response.json();

      setSavedFlashcards(data);
    } catch (err) {
      console.error(err);

      setError(
        "Could not load saved flashcards.",
      );
    }
  };

  /* =========================
     GENERATE FLASHCARDS
  ========================= */

  const generateFlashcards = async () => {
    setGeneratingFlashcards(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        `http://localhost:8080/courses/${courseId}/flashcards/generate?flashcardCount=${flashcardCount}`,
        {
          method: "POST",
        },
      );

      if (!response.ok) {
        const text = await response.text();

        throw new Error(
          text || "Failed to generate flashcards.",
        );
      }

      const data: FlashcardSet =
        await response.json();

      setFlashcards(data);
      setCurrentFlashcardIndex(0);
      setFlashcardFlipped(false);

      setMessage(
        "Flashcards generated successfully.",
      );

      await loadSavedFlashcards();
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Could not generate flashcards.",
      );
    } finally {
      setGeneratingFlashcards(false);
    }
  };

  /* =========================
     SAVED FLASHCARDS
  ========================= */

  const openSavedFlashcards = (
    saved: SavedFlashcardSet,
  ) => {
    try {
      const parsed = JSON.parse(
        saved.content,
      ) as FlashcardSet;

      setFlashcards(parsed);
      setCurrentFlashcardIndex(0);
      setFlashcardFlipped(false);
      setError("");
      setMessage("");
    } catch (err) {
      console.error(err);

      setError(
        "Could not open this saved flashcard set.",
      );
    }
  };

  const deleteSavedFlashcards = async (
    flashcardSetId: number,
  ) => {
    const confirmed = window.confirm(
      "Delete this saved flashcard set?",
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/courses/${courseId}/flashcards/${flashcardSetId}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        throw new Error(
          "Failed to delete flashcards.",
        );
      }

      setSavedFlashcards((current) =>
        current.filter(
          (saved) =>
            saved.id !== flashcardSetId,
        ),
      );

      setMessage(
        "Flashcard set deleted.",
      );
    } catch (err) {
      console.error(err);

      setError(
        "Could not delete the flashcard set.",
      );
    }
  };

  /* =========================
     HELPERS
  ========================= */

  const formatDate = (date: string) => {
    if (!date) {
      return "";
    }

    return new Date(date).toLocaleString();
  };

  const currentFlashcard =
    flashcards?.flashcards[
      currentFlashcardIndex
    ];

  /* =========================
     UI
  ========================= */

  return (
    <section className="course-panel">
      <div className="panel-header">
        <div>
          <h2>Flashcards</h2>

          <p>
            Generate question-and-answer cards
            from the important concepts in your
            course materials.
          </p>
        </div>

        <span className="panel-badge">
          AI Study Tool
        </span>
      </div>

      {message && (
        <div className="course-message">
          {message}
        </div>
      )}

      {error && (
        <div className="course-message error">
          {error}
        </div>
      )}

      <div className="study-generator-controls">
        <div className="study-control">
          <label htmlFor="flashcard-count">
            Flashcards
          </label>

          <input
            id="flashcard-count"
            type="number"
            min="1"
            max="20"
            value={flashcardCount}
            onChange={(event) =>
              setFlashcardCount(
                Number(event.target.value),
              )
            }
          />
        </div>

        <button
          className="generate-button"
          onClick={generateFlashcards}
          disabled={
            generatingFlashcards ||
            materialCount === 0
          }
        >
          {generatingFlashcards
            ? "Generating..."
            : "Generate Flashcards"}
        </button>
      </div>

      {materialCount === 0 && (
        <div className="course-message">
          Upload study material before generating
          flashcards.
        </div>
      )}

      {flashcards && currentFlashcard && (
        <>
          <div
            className={
              flashcardFlipped
                ? "flashcard flipped"
                : "flashcard"
            }
            onClick={() =>
              setFlashcardFlipped(
                (current) => !current,
              )
            }
          >
            <div className="flashcard-inner">
              <div className="flashcard-face flashcard-front">
                <span className="flashcard-label">
                  Question
                </span>

                <h3>
                  {currentFlashcard.front}
                </h3>

                <small>
                  Click card to reveal answer
                </small>
              </div>

              <div className="flashcard-face flashcard-back">
                <span className="flashcard-label">
                  Answer
                </span>

                <h3>
                  {currentFlashcard.back}
                </h3>

                <small>
                  Click card to see question
                </small>
              </div>
            </div>
          </div>

          <div className="flashcard-navigation">
            <button
              disabled={
                currentFlashcardIndex === 0
              }
              onClick={() => {
                setCurrentFlashcardIndex(
                  (current) => current - 1,
                );

                setFlashcardFlipped(false);
              }}
            >
              ← Previous
            </button>

            <button disabled>
              {currentFlashcardIndex + 1} /{" "}
              {flashcards.flashcards.length}
            </button>

            <button
              disabled={
                currentFlashcardIndex ===
                flashcards.flashcards.length - 1
              }
              onClick={() => {
                setCurrentFlashcardIndex(
                  (current) => current + 1,
                );

                setFlashcardFlipped(false);
              }}
            >
              Next →
            </button>
          </div>
        </>
      )}

      <div className="saved-section">
        <div className="saved-section-header">
          <h3>Saved Flashcard Sets</h3>

          <span className="saved-count">
            {savedFlashcards.length} saved
          </span>
        </div>

        {savedFlashcards.length === 0 ? (
          <div className="course-empty-state">
            <h3>No saved flashcards</h3>

            <p>
              Generated flashcard sets will
              appear here.
            </p>
          </div>
        ) : (
          <div className="saved-items-grid">
            {savedFlashcards.map((saved) => (
              <div
                className="saved-item"
                key={saved.id}
              >
                <div className="saved-item-content">
                  <h4>{saved.title}</h4>

                  <p>
                    {formatDate(
                      saved.createdAt,
                    )}
                  </p>
                </div>

                <div className="saved-item-actions">
                  <button
                    className="saved-open-button"
                    onClick={() =>
                      openSavedFlashcards(saved)
                    }
                  >
                    Open
                  </button>

                  <button
                    className="saved-delete-button"
                    onClick={() =>
                      deleteSavedFlashcards(
                        saved.id,
                      )
                    }
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default FlashcardsTab;