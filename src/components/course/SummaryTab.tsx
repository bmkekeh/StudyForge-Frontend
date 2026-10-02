import { useEffect, useState } from "react";

import type {
  StudySummary,
  SavedSummary,
} from "../../types/course";

type SummaryTabProps = {
  courseId: number;
  materialCount: number;
};

function SummaryTab({
  courseId,
  materialCount,
}: SummaryTabProps) {
  const [summary, setSummary] =
    useState<StudySummary | null>(null);

  const [savedSummaries, setSavedSummaries] =
    useState<SavedSummary[]>([]);

  const [generatingSummary, setGeneratingSummary] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  /* =========================
     LOAD SAVED SUMMARIES
  ========================= */

  useEffect(() => {
    if (!courseId) {
      return;
    }

    async function load() {
      try {
        const response = await fetch(
          `http://localhost:8080/courses/${courseId}/summary`,
        );

        if (!response.ok) {
          throw new Error(
            "Failed to load summaries.",
          );
        }

        const data: SavedSummary[] =
          await response.json();

        setSavedSummaries(data);
      } catch (err) {
        console.error(err);

        setError(
          "Could not load saved summaries.",
        );
      }
    }

    void load();
  }, [courseId]);

  async function loadSavedSummaries()  {
    try {
      const response = await fetch(
        `http://localhost:8080/courses/${courseId}/summary`,
      );

      if (!response.ok) {
        throw new Error(
          "Failed to load summaries.",
        );
      }

      const data: SavedSummary[] =
        await response.json();

      setSavedSummaries(data);
    } catch (err) {
      console.error(err);

      setError(
        "Could not load saved summaries.",
      );
    }
  }


  /* =========================
     GENERATE SUMMARY
  ========================= */

  const generateSummary = async () => {
    setGeneratingSummary(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        `http://localhost:8080/courses/${courseId}/summary/generate`,
        {
          method: "POST",
        },
      );

      if (!response.ok) {
        const text =
          await response.text();

        throw new Error(
          text ||
            "Failed to generate summary.",
        );
      }

      const data: StudySummary =
        await response.json();

      setSummary(data);

      setMessage(
        "Study summary generated.",
      );

      await loadSavedSummaries();
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Could not generate summary.",
      );
    } finally {
      setGeneratingSummary(false);
    }
  };

  /* =========================
     SAVED SUMMARIES
  ========================= */

  const openSavedSummary = (
    saved: SavedSummary,
  ) => {
    try {
      const parsed = JSON.parse(
        saved.content,
      ) as StudySummary;

      setSummary(parsed);
      setError("");
      setMessage("");
    } catch (err) {
      console.error(err);

      setError(
        "Could not open this saved summary.",
      );
    }
  };

  const deleteSavedSummary = async (
    summaryId: number,
  ) => {
    const confirmed = window.confirm(
      "Delete this saved summary?",
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/courses/${courseId}/summary/${summaryId}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        throw new Error(
          "Failed to delete summary.",
        );
      }

      setSavedSummaries((current) =>
        current.filter(
          (saved) =>
            saved.id !== summaryId,
        ),
      );

      setMessage(
        "Saved summary deleted.",
      );
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Could not delete the summary.",
      );
    }
  };

  /* =========================
     HELPERS
  ========================= */

  const formatDate = (
    date: string,
  ) => {
    if (!date) {
      return "";
    }

    return new Date(
      date,
    ).toLocaleString();
  };

  /* =========================
     UI
  ========================= */

  return (
    <section className="course-panel">

      {/* =====================
          HEADER
      ====================== */}

      <div className="panel-header">
        <div>
          <h2>Study Summary</h2>

          <p>
            Turn your uploaded materials
            into a focused review guide.
          </p>
        </div>

        <span className="panel-badge">
          AI Study Tool
        </span>
      </div>

      {/* =====================
          MESSAGES
      ====================== */}

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

      {/* =====================
          GENERATE
      ====================== */}

      <div className="summary-actions">

        <button
          className="generate-button"
          onClick={generateSummary}
          disabled={
            generatingSummary ||
            materialCount === 0
          }
        >
          {generatingSummary
            ? "Generating..."
            : "Generate Summary"}
        </button>

        {materialCount === 0 && (
          <span className="helper-text">
            Upload study material first.
          </span>
        )}

      </div>

      {/* =====================
          GENERATED SUMMARY
      ====================== */}

      {summary && (
        <div className="summary-card">

          <div className="summary-title-row">
            <div>
              <span className="summary-kicker">
                Generated Review
              </span>

              <h3>
                {summary.title}
              </h3>
            </div>
          </div>

          {/* OVERVIEW */}

          <div className="summary-section">
            <h4>Overview</h4>

            <p>
              {summary.overview}
            </p>
          </div>

          {/* KEY CONCEPTS */}

          <div className="summary-section">
            <h4>Key Concepts</h4>

            <div className="concept-grid">

              {summary.keyConcepts.map(
                (concept, index) => (
                  <div
                    className="concept-card"
                    key={`${concept.concept}-${index}`}
                  >
                    <strong>
                      {concept.concept}
                    </strong>

                    <p>
                      {
                        concept.explanation
                      }
                    </p>
                  </div>
                ),
              )}

            </div>
          </div>

          {/* IMPORTANT / REVIEW */}

          <div className="summary-two-column">

            <div className="summary-section">
              <h4>
                Important Points
              </h4>

              <ul>
                {summary.importantPoints.map(
                  (point, index) => (
                    <li key={index}>
                      {point}
                    </li>
                  ),
                )}
              </ul>
            </div>

            <div className="summary-section">
              <h4>
                Review Topics
              </h4>

              <ul>
                {summary.reviewTopics.map(
                  (topic, index) => (
                    <li key={index}>
                      {topic}
                    </li>
                  ),
                )}
              </ul>
            </div>

          </div>

        </div>
      )}

      {/* =====================
          SAVED SUMMARIES
      ====================== */}

      <div className="saved-section">

        <div className="saved-section-header">
          <h3>
            Saved Summaries
          </h3>

          <span className="saved-count">
            {savedSummaries.length} saved
          </span>
        </div>

        {savedSummaries.length === 0 ? (
          <div className="course-empty-state">

            <h3>
              No saved summaries
            </h3>

            <p>
              Generated summaries will
              appear here.
            </p>

          </div>
        ) : (
          <div className="saved-items-grid">

            {savedSummaries.map(
              (saved) => (
                <div
                  className="saved-item"
                  key={saved.id}
                >

                  <div className="saved-item-content">

                    <h4>
                      {saved.title}
                    </h4>

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
                        openSavedSummary(
                          saved,
                        )
                      }
                    >
                      Open
                    </button>

                    <button
                      className="saved-delete-button"
                      onClick={() =>
                        deleteSavedSummary(
                          saved.id,
                        )
                      }
                    >
                      Delete
                    </button>

                  </div>

                </div>
              ),
            )}

          </div>
        )}

      </div>

    </section>
  );
}

export default SummaryTab;