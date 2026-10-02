import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import OverviewTab from "../components/course/OverviewTab";
import MaterialsTab from "../components/course/MaterialsTab";
import SummaryTab from "../components/course/SummaryTab";
import QuizTab from "../components/course/QuizTab";
import FlashcardsTab from "../components/course/FlashcardsTab";
import ProgressTab from "../components/course/ProgressTab";

import type {
  Course,
  StudyMaterial,
  QuizAttempt,
  QuizAttemptStats,
  WeakTopic,
  GeneratedQuizResponse,
  Tab,
} from "../types/course";

function CoursePage() {
  const { id } = useParams();

  const navigate = useNavigate();

  const courseId = Number(id);

  /* =========================
     STATE
  ========================= */

  const [course, setCourse] =
    useState<Course | null>(null);

  const [materials, setMaterials] =
    useState<StudyMaterial[]>([]);

  const [activeTab, setActiveTab] =
    useState<Tab>("overview");

  const [weakTopics, setWeakTopics] =
    useState<WeakTopic[]>([]);

  const [error, setError] =
    useState("");

  /* =========================
     PROGRESS STATE
  ========================= */

  const [quizStats, setQuizStats] =
    useState<QuizAttemptStats | null>(null);

  const [quizAttempts, setQuizAttempts] =
    useState<QuizAttempt[]>([]);

  const [
    loadingQuizStats,
    setLoadingQuizStats,
  ] = useState(true);

  const [
    practiceQuiz,
    setPracticeQuiz,
  ] =
    useState<GeneratedQuizResponse | null>(
      null,
    );

  /* =========================
     LOAD DATA
  ========================= */

  useEffect(() => {
    if (!courseId) {
      return;
    }

    /* =========================
       LOAD COURSE
    ========================= */

    const loadCourse = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/courses/${courseId}`,
        );

        if (!response.ok) {
          throw new Error(
            "Failed to load course.",
          );
        }

        const data: Course =
          await response.json();

        setCourse(data);
      } catch (err) {
        console.error(err);

        setError(
          "Could not load this course.",
        );
      }
    };

    /* =========================
       LOAD MATERIALS
    ========================= */

    const loadMaterials = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/courses/${courseId}/materials`,
        );

        if (!response.ok) {
          throw new Error(
            "Failed to load materials.",
          );
        }

        const data: StudyMaterial[] =
          await response.json();

        setMaterials(data);
      } catch (err) {
        console.error(err);

        setError(
          "Could not load study materials.",
        );
      }
    };

    /* =========================
       LOAD QUIZ STATS
    ========================= */

    const loadQuizStats = async () => {
      setLoadingQuizStats(true);

      try {
        const response = await fetch(
          `http://localhost:8080/courses/${courseId}/quiz-attempts/stats`,
        );

        if (!response.ok) {
          throw new Error(
            "Failed to load quiz statistics.",
          );
        }

        const data: QuizAttemptStats =
          await response.json();

        setQuizStats(data);
      } catch (err) {
        console.error(err);

        setError(
          "Could not load quiz progress.",
        );
      } finally {
        setLoadingQuizStats(false);
      }
    };

    /* =========================
       LOAD QUIZ ATTEMPTS
    ========================= */

    const loadQuizAttempts = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/courses/${courseId}/quiz-attempts`,
        );

        if (!response.ok) {
          throw new Error(
            "Failed to load quiz attempts.",
          );
        }

        const data: QuizAttempt[] =
          await response.json();

        setQuizAttempts(data);
      } catch (err) {
        console.error(err);

        setError(
          "Could not load quiz attempt history.",
        );
      }
    };

    /* =========================
       LOAD WEAK TOPICS
    ========================= */

    const loadWeakTopics = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/courses/${courseId}/quiz-attempts/weak-topics`,
        );

        if (!response.ok) {
          throw new Error(
            "Failed to load weak topics.",
          );
        }

        const data: WeakTopic[] =
          await response.json();

        setWeakTopics(data);
      } catch (err) {
        console.error(err);

        setWeakTopics([]);
      }
    };

    /* =========================
       RUN LOADERS
    ========================= */

    loadCourse();
    loadMaterials();
    loadQuizStats();
    loadQuizAttempts();
    loadWeakTopics();
  }, [courseId]);

  /* =========================
     DELETE COURSE
  ========================= */

  const deleteCourse = async () => {
    const confirmed = window.confirm(
      "Delete this course? This cannot be undone.",
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/courses/${courseId}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        throw new Error(
          "Failed to delete course.",
        );
      }

      navigate("/");
    } catch (err) {
      console.error(err);

      setError(
        "Could not delete the course.",
      );
    }
  };

  /* =========================
     INVALID COURSE ID
  ========================= */

  if (!courseId) {
    return (
      <div className="course-page-shell">
        <div className="course-page">
          <div className="course-message error">
            Invalid course ID.
          </div>

          <Link
            to="/"
            className="back-link"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  /* =========================
     UI
  ========================= */

  return (
    <div className="course-page-shell">
      <div className="course-page">

        {/* =====================
            TOP BAR
        ====================== */}

        <div className="course-topbar">
          <Link
            to="/"
            className="back-link"
          >
            ← Back to Dashboard
          </Link>

          <span className="course-brand">
            StudyForge
          </span>
        </div>

        {/* =====================
            COURSE HEADER
        ====================== */}

        <section className="course-hero">
          <div className="course-hero-main">
            <div className="course-hero-icon">
              {course?.name
                ?.charAt(0)
                .toUpperCase() || "C"}
            </div>

            <div className="course-hero-copy">
              <span className="course-eyebrow">
                Course Workspace
              </span>

              <h1>
                {course?.name ||
                  "Loading course..."}
              </h1>

              <p>
                {course?.description ||
                  "Organize your materials and generate study tools."}
              </p>
            </div>
          </div>

          <button
            type="button"
            className="delete-course-button"
            onClick={deleteCourse}
          >
            Delete Course
          </button>
        </section>

        {/* =====================
            ERROR
        ====================== */}

        {error && (
          <div className="course-message error">
            {error}
          </div>
        )}

        {/* =====================
            TAB NAVIGATION
        ====================== */}

        <nav className="course-tabs">

          <button
            type="button"
            className={
              activeTab === "overview"
                ? "course-tab active"
                : "course-tab"
            }
            onClick={() =>
              setActiveTab("overview")
            }
          >
            Overview
          </button>

          <button
            type="button"
            className={
              activeTab === "materials"
                ? "course-tab active"
                : "course-tab"
            }
            onClick={() =>
              setActiveTab("materials")
            }
          >
            Materials
          </button>

          <button
            type="button"
            className={
              activeTab === "summary"
                ? "course-tab active"
                : "course-tab"
            }
            onClick={() =>
              setActiveTab("summary")
            }
          >
            Summary
          </button>

          <button
            type="button"
            className={
              activeTab === "quizzes"
                ? "course-tab active"
                : "course-tab"
            }
            onClick={() =>
              setActiveTab("quizzes")
            }
          >
            Quizzes
          </button>

          <button
            type="button"
            className={
              activeTab === "flashcards"
                ? "course-tab active"
                : "course-tab"
            }
            onClick={() =>
              setActiveTab("flashcards")
            }
          >
            Flashcards
          </button>

          <button
            type="button"
            className={
              activeTab === "progress"
                ? "course-tab active"
                : "course-tab"
            }
            onClick={() =>
              setActiveTab("progress")
            }
          >
            Progress
          </button>

        </nav>

        {/* =====================
            TAB CONTENT
        ====================== */}

        <main className="course-tab-content">

          {activeTab === "overview" && (
            <OverviewTab
              materialCount={
                materials.length
              }
              setActiveTab={
                setActiveTab
              }
            />
          )}

          {activeTab === "materials" && (
            <MaterialsTab
              courseId={courseId}
              materials={materials}
              setMaterials={
                setMaterials
              }
            />
          )}

          {activeTab === "summary" && (
            <SummaryTab
              courseId={courseId}
              materialCount={
                materials.length
              }
            />
          )}

          {activeTab === "quizzes" && (
            <QuizTab
              courseId={courseId}
              practiceQuiz={practiceQuiz}
            />
          )}

          {activeTab === "flashcards" && (
            <FlashcardsTab
              courseId={courseId}
              materialCount={
                materials.length
              }
            />
          )}

          {activeTab === "progress" && (
            <ProgressTab
              courseId={courseId}
              stats={quizStats}
              attempts={quizAttempts}
              weakTopics={weakTopics}
              loading={loadingQuizStats}
              setActiveTab={setActiveTab}
              setPracticeQuiz={setPracticeQuiz}
            />
          )}

        </main>
      </div>
    </div>
  );
}

export default CoursePage;