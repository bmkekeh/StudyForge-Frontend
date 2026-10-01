import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type Course = {
  id: number;
  name: string;
  description: string;
};

function Dashboard() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [addingCourse, setAddingCourse] = useState(false);
  const [loadingCourses, setLoadingCourses] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    setLoadingCourses(true);
    setError("");

    try {
      const response = await fetch(
        "http://localhost:8080/courses",
      );

      if (!response.ok) {
        throw new Error("Failed to load courses.");
      }

      const data = await response.json();

      setCourses(data);
    } catch (err) {
      console.error(err);
      setError(
        "Could not load your courses. Make sure the backend is running.",
      );
    } finally {
      setLoadingCourses(false);
    }
  };

  const addCourse = async () => {
    if (!name.trim()) {
      setError("Enter a course name first.");
      return;
    }

    setAddingCourse(true);
    setError("");

    try {
      const response = await fetch(
        "http://localhost:8080/courses",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
            description: description.trim(),
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to create course.");
      }

      const newCourse = await response.json();

      setCourses((currentCourses) => [
        ...currentCourses,
        newCourse,
      ]);

      setName("");
      setDescription("");
    } catch (err) {
      console.error(err);
      setError(
        "Could not create the course. Please try again.",
      );
    } finally {
      setAddingCourse(false);
    }
  };

  const getCourseInitials = (courseName: string) => {
    const words = courseName
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    if (words.length === 0) {
      return "SF";
    }

    if (words.length === 1) {
      return words[0]
        .substring(0, 2)
        .toUpperCase();
    }

    return (
      words[0].charAt(0) +
      words[1].charAt(0)
    ).toUpperCase();
  };

  const handleFormKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Enter") {
      addCourse();
    }
  };

  return (
    <div className="dashboard-page">

      {/* =========================
          NAVBAR
      ========================== */}

      <header className="dashboard-nav">
        <div className="dashboard-nav-inner">

          <Link to="/" className="dashboard-brand">
            <div className="brand-icon">
              S
            </div>

            <div className="brand-text">
              <span className="brand-name">
                StudyForge
              </span>

              <span className="brand-subtitle">
                AI Study Workspace
              </span>
            </div>
          </Link>

          <div className="dashboard-nav-right">
            <span className="nav-status-dot" />

            <span className="nav-status-text">
              Workspace
            </span>
          </div>

        </div>
      </header>

      <main className="dashboard-container">

        {/* =========================
            HERO
        ========================== */}

        <section className="dashboard-hero">

          <div className="dashboard-hero-content">

            <div className="hero-label">
              <span className="hero-label-dot" />
              YOUR STUDY WORKSPACE
            </div>

            <h1>
              Study smarter with
              <span> your own material.</span>
            </h1>

            <p>
              Organize your courses, upload study
              material, and turn your notes into
              summaries, practice quizzes, and
              flashcards.
            </p>

          </div>

          <div className="dashboard-summary-card">

            <div className="summary-card-icon">
              S
            </div>

            <div>
              <span className="summary-card-number">
                {courses.length}
              </span>

              <span className="summary-card-label">
                {courses.length === 1
                  ? "course in your workspace"
                  : "courses in your workspace"}
              </span>
            </div>

          </div>

        </section>

        {/* =========================
            CREATE COURSE
        ========================== */}

        <section className="create-course-card">

          <div className="create-course-top">

            <div className="create-course-title">

              <div className="create-course-icon">
                +
              </div>

              <div>
                <h2>Create a course</h2>

                <p>
                  Start a new workspace for your
                  course materials.
                </p>
              </div>

            </div>

            <span className="create-course-badge">
              New
            </span>

          </div>

          <div className="course-form">

            <div className="form-field">

              <label htmlFor="course-name">
                Course name
              </label>

              <input
                id="course-name"
                type="text"
                placeholder="e.g. COMP 3430"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                onKeyDown={handleFormKeyDown}
              />

            </div>

            <div className="form-field">

              <label htmlFor="course-description">
                Description
              </label>

              <input
                id="course-description"
                type="text"
                placeholder="e.g. Operating Systems"
                value={description}
                onChange={(event) =>
                  setDescription(
                    event.target.value,
                  )
                }
                onKeyDown={handleFormKeyDown}
              />

            </div>

            <button
              className="primary-button add-course-button"
              onClick={addCourse}
              disabled={
                addingCourse || !name.trim()
              }
            >
              {addingCourse ? (
                <>
                  <span className="button-spinner" />
                  Creating...
                </>
              ) : (
                <>
                  <span className="button-plus">
                    +
                  </span>
                  Add Course
                </>
              )}
            </button>

          </div>

          {error && (
            <div className="dashboard-error">
              <span>!</span>
              {error}
            </div>
          )}

        </section>

        {/* =========================
            COURSES
        ========================== */}

        <section className="courses-section">

          <div className="dashboard-section-header">

            <div>
              <span className="section-label">
                COURSES
              </span>

              <h2>My Courses</h2>
            </div>

            {!loadingCourses && (
              <span className="course-count">
                {courses.length}{" "}
                {courses.length === 1
                  ? "course"
                  : "courses"}
              </span>
            )}

          </div>

          {/* LOADING */}

          {loadingCourses && (
            <div className="course-grid">

              {[1, 2, 3].map((item) => (
                <div
                  className="course-card course-card-loading"
                  key={item}
                >
                  <div className="skeleton skeleton-icon" />
                  <div className="skeleton skeleton-title" />
                  <div className="skeleton skeleton-text" />
                  <div className="skeleton skeleton-text short" />
                </div>
              ))}

            </div>
          )}

          {/* EMPTY */}

          {!loadingCourses &&
            courses.length === 0 && (
              <div className="empty-courses">

                <div className="empty-course-visual">

                  <div className="empty-course-icon">
                    +
                  </div>

                </div>

                <h3>
                  Create your first course
                </h3>

                <p>
                  Add a course above, then upload
                  your study material to start
                  generating study tools.
                </p>

              </div>
            )}

          {/* COURSE CARDS */}

          {!loadingCourses &&
            courses.length > 0 && (
              <div className="course-grid">

                {courses.map(
                  (course, index) => (
                    <article
                      className="course-card"
                      key={course.id}
                    >

                      <div className="course-card-header">

                        <div className="course-avatar">
                          {getCourseInitials(
                            course.name,
                          )}
                        </div>

                        <div className="course-card-number">
                          {String(index + 1).padStart(
                            2,
                            "0",
                          )}
                        </div>

                      </div>

                      <div className="course-card-body">

                        <h3>{course.name}</h3>

                        <p>
                          {course.description ||
                            "No course description provided."}
                        </p>

                      </div>

                      <div className="course-tools">

                        <span>
                          <span className="tool-dot" />
                          Summary
                        </span>

                        <span>
                          <span className="tool-dot" />
                          Quiz
                        </span>

                        <span>
                          <span className="tool-dot" />
                          Flashcards
                        </span>

                      </div>

                      <Link
                        className="open-course-link"
                        to={`/courses/${course.id}`}
                      >
                        <span>
                          Open workspace
                        </span>

                        <span className="open-course-arrow">
                          →
                        </span>
                      </Link>

                    </article>
                  ),
                )}

              </div>
            )}

        </section>

      </main>

      {/* =========================
          FOOTER
      ========================== */}

      <footer className="dashboard-footer">

        <div className="dashboard-footer-inner">

          <div className="footer-brand">
            <div className="footer-brand-icon">
              S
            </div>

            <span>StudyForge</span>
          </div>

          <p>
            Turn your course material into
            smarter study tools.
          </p>

        </div>

      </footer>

    </div>
  );
}

export default Dashboard;