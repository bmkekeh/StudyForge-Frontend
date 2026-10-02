import { useState } from "react";

import type {
  QuizAttempt,
  QuizAttemptStats,
  WeakTopic,
  Tab,
  GeneratedQuizResponse,
} from "../../types/course";

type ProgressTabProps = {
  courseId: number;
  stats: QuizAttemptStats | null;
  attempts: QuizAttempt[];
  weakTopics: WeakTopic[];
  loading: boolean;
  setActiveTab: (tab: Tab) => void;
  setPracticeQuiz: (
    quiz: GeneratedQuizResponse,
  ) => void;
};

function ProgressTab({
  courseId,
  stats,
  attempts,
  weakTopics,
  loading,
  setActiveTab,
  setPracticeQuiz,
}: ProgressTabProps) {
  /* =========================
     PRACTICE WEAK TOPICS
  ========================= */

  const [
    generatingPractice,
    setGeneratingPractice,
  ] = useState(false);

  const [
    practiceError,
    setPracticeError,
  ] = useState("");

  const practiceWeakTopics =
    async () => {
      if (weakTopics.length === 0) {
        return;
      }

      setGeneratingPractice(true);
      setPracticeError("");

      try {
        const topics =
          weakTopics.map(
            (weakTopic) =>
              weakTopic.topic,
          );

        const response =
          await fetch(
            `http://localhost:8080/courses/${courseId}/quiz/weak-topics?questionCount=5&difficulty=medium`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify(
                topics,
              ),
            },
          );

        if (!response.ok) {
          const text =
            await response.text();

          throw new Error(
            text ||
              "Failed to generate practice quiz.",
          );
        }

        /*
         * The backend returns the generated
         * quiz and also saves it in the
         * generated_quiz table.
         *
         * We do not need the returned quiz
         * here yet because QuizTab currently
         * manages its own quiz state.
         */
        const generatedQuiz:
          GeneratedQuizResponse =
            await response.json();

        setPracticeQuiz(
          generatedQuiz,
        );

        setActiveTab("quizzes");
      } catch (err) {
        console.error(err);

        setPracticeError(
          err instanceof Error
            ? err.message
            : "Could not generate practice quiz.",
        );
      } finally {
        setGeneratingPractice(
          false,
        );
      }
    };

  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <section className="course-panel">
        <div className="panel-header">
          <div>
            <h2>
              Study Progress
            </h2>

            <p>
              Track your quiz
              performance and study
              progress.
            </p>
          </div>

          <span className="panel-badge">
            Analytics
          </span>
        </div>

        <p>
          Loading progress...
        </p>
      </section>
    );
  }

  /* =========================
     NO ATTEMPTS
  ========================= */

  if (
    !stats ||
    stats.attemptsCompleted === 0
  ) {
    return (
      <section className="course-panel">
        <div className="panel-header">
          <div>
            <h2>
              Study Progress
            </h2>

            <p>
              Track your quiz
              performance and study
              progress.
            </p>
          </div>

          <span className="panel-badge">
            Analytics
          </span>
        </div>

        <div className="overview-info-card">
          <h3>
            No quiz attempts yet
          </h3>

          <p>
            Complete a quiz to start
            tracking your performance.
          </p>
        </div>
      </section>
    );
  }

  /*
   * Backend returns newest attempts
   * first.
   *
   * Reverse a copy so the chart reads
   * oldest -> newest from left to right.
   */
  const chronologicalAttempts =
    [...attempts].reverse();

  /*
   * Find the largest mistake count.
   *
   * This lets the largest weak topic
   * have a 100% width bar and makes
   * the other bars proportional to it.
   */
  const largestMistakeCount =
    weakTopics.length > 0
      ? Math.max(
          ...weakTopics.map(
            (topic) =>
              topic.mistakeCount,
          ),
        )
      : 0;

  return (
    <section className="course-panel">

      {/* =====================
          HEADER
      ====================== */}

      <div className="panel-header">
        <div>
          <h2>
            Study Progress
          </h2>

          <p>
            Track your quiz
            performance and see how
            you're doing in this
            course.
          </p>
        </div>

        <span className="panel-badge">
          Analytics
        </span>
      </div>

      {/* =====================
          STATS
      ====================== */}

      <div className="progress-stats-grid">

        <div className="progress-stat-card">
          <span className="progress-stat-label">
            Quizzes Completed
          </span>

          <strong className="progress-stat-value">
            {
              stats
                .attemptsCompleted
            }
          </strong>

          <span className="progress-stat-description">
            Total attempts
          </span>
        </div>

        <div className="progress-stat-card">
          <span className="progress-stat-label">
            Average Score
          </span>

          <strong className="progress-stat-value">
            {stats.averageScore.toFixed(
              1,
            )}
            %
          </strong>

          <span className="progress-stat-description">
            Across all quizzes
          </span>
        </div>

        <div className="progress-stat-card">
          <span className="progress-stat-label">
            Best Score
          </span>

          <strong className="progress-stat-value">
            {stats.bestScore.toFixed(
              1,
            )}
            %
          </strong>

          <span className="progress-stat-description">
            Your highest result
          </span>
        </div>

        <div className="progress-stat-card">
          <span className="progress-stat-label">
            Latest Score
          </span>

          <strong className="progress-stat-value">
            {stats.latestScore.toFixed(
              1,
            )}
            %
          </strong>

          <span className="progress-stat-description">
            Most recent attempt
          </span>
        </div>

      </div>

      {/* =====================
          TOPICS TO REVIEW
      ====================== */}

      <div className="progress-history">

        <div className="progress-section-header">

          <div>
            <h3>
              Topics to Review
            </h3>

            <p>
              Topics where you've
              made the most quiz
              mistakes.
            </p>
          </div>

          {weakTopics.length >
            0 && (
            <button
              type="button"
              className="practice-weak-topics-button"
              onClick={
                practiceWeakTopics
              }
              disabled={
                generatingPractice
              }
            >
              {generatingPractice
                ? "Generating..."
                : "Practice Weak Topics"}
            </button>
          )}

        </div>

        {/* PRACTICE ERROR */}

        {practiceError && (
          <div className="course-message error">
            {practiceError}
          </div>
        )}

        {/* NO WEAK TOPICS */}

        {weakTopics.length ===
        0 ? (
          <div className="overview-info-card">
            <h3>
              No weak topics yet
            </h3>

            <p>
              Complete more quizzes
              to identify topics that
              may need extra review.
            </p>
          </div>
        ) : (
          <div className="weak-topics-list">

            {weakTopics.map(
              (weakTopic) => {
                const barWidth =
                  largestMistakeCount >
                  0
                    ? (
                        weakTopic
                          .mistakeCount /
                        largestMistakeCount
                      ) * 100
                    : 0;

                return (
                  <div
                    className="weak-topic-item"
                    key={
                      weakTopic.topic
                    }
                  >
                    <div className="weak-topic-header">

                      <strong>
                        {
                          weakTopic.topic
                        }
                      </strong>

                      <span>
                        {
                          weakTopic
                            .mistakeCount
                        }{" "}
                        {weakTopic
                          .mistakeCount ===
                        1
                          ? "mistake"
                          : "mistakes"}
                      </span>

                    </div>

                    <div className="weak-topic-track">

                      <div
                        className="weak-topic-bar"
                        style={{
                          width:
                            `${barWidth}%`,
                        }}
                      />

                    </div>

                  </div>
                );
              },
            )}

          </div>
        )}

      </div>

      {/* =====================
          PERFORMANCE HISTORY
      ====================== */}

      <div className="progress-history">

        <div className="progress-section-header">
          <div>
            <h3>
              Performance History
            </h3>

            <p>
              See how your quiz
              scores change over
              time.
            </p>
          </div>
        </div>

        <div className="progress-chart">

          {chronologicalAttempts.map(
            (
              attempt,
              index,
            ) => {
              const percentage =
                attempt.totalQuestions >
                0
                  ? (
                      attempt.score /
                      attempt
                        .totalQuestions
                    ) * 100
                  : 0;

              return (
                <div
                  className="progress-chart-item"
                  key={attempt.id}
                >
                  <span className="progress-chart-score">
                    {percentage.toFixed(
                      0,
                    )}
                    %
                  </span>

                  <div className="progress-chart-track">

                    <div
                      className="progress-chart-bar"
                      style={{
                        height:
                          `${percentage}%`,
                      }}
                    />

                  </div>

                  <span className="progress-chart-label">
                    {index + 1}
                  </span>
                </div>
              );
            },
          )}

        </div>

        <div className="progress-chart-caption">
          <span>
            Older attempts
          </span>

          <span>
            Recent attempts
          </span>
        </div>

      </div>

      {/* =====================
          RECENT ATTEMPTS
      ====================== */}

      <div className="progress-history">

        <div className="progress-section-header">
          <div>
            <h3>
              Recent Attempts
            </h3>

            <p>
              Your completed quiz
              results.
            </p>
          </div>
        </div>

        <div className="progress-attempt-list">

          {attempts.map(
            (attempt) => {
              const percentage =
                attempt.totalQuestions >
                0
                  ? (
                      attempt.score /
                      attempt
                        .totalQuestions
                    ) * 100
                  : 0;

              return (
                <div
                  className="progress-attempt-row"
                  key={attempt.id}
                >
                  <div className="progress-attempt-info">

                    <strong>
                      {attempt.score}/
                      {
                        attempt
                          .totalQuestions
                      }
                    </strong>

                    <span>
                      {new Date(
                        attempt
                          .completedAt,
                      ).toLocaleDateString()}
                    </span>

                  </div>

                  <strong className="progress-attempt-score">
                    {percentage.toFixed(
                      1,
                    )}
                    %
                  </strong>

                </div>
              );
            },
          )}

        </div>

      </div>

    </section>
  );
}

export default ProgressTab;