import type { Tab } from "../../types/course";

type OverviewTabProps = {
  materialCount: number;
  setActiveTab: (tab: Tab) => void;
};

function OverviewTab({
  materialCount,
  setActiveTab,
}: OverviewTabProps) {
  return (
    <section className="course-panel">
      <div className="panel-header">
        <div>
          <h2>Course Overview</h2>
          <p>
            Everything you need to study this course in one place.
          </p>
        </div>

        <span className="panel-badge">
          Workspace
        </span>
      </div>

      <div className="overview-grid">

        <button
          type="button"
          className="overview-card"
          onClick={() => setActiveTab("materials")}
        >
          <span className="overview-icon">
            📄
          </span>

          <div>
            <strong>Materials</strong>
            <span>{materialCount} uploaded</span>
          </div>
        </button>

        <button
          type="button"
          className="overview-card"
          onClick={() => setActiveTab("summary")}
        >
          <span className="overview-icon">
            ✨
          </span>

          <div>
            <strong>Summaries</strong>
            <span>Generate a review guide</span>
          </div>
        </button>

        <button
          type="button"
          className="overview-card"
          onClick={() => setActiveTab("quizzes")}
        >
          <span className="overview-icon">
            ?
          </span>

          <div>
            <strong>Quizzes</strong>
            <span>Generate and practice</span>
          </div>
        </button>

        <button
          type="button"
          className="overview-card"
          onClick={() => setActiveTab("flashcards")}
        >
          <span className="overview-icon">
            ◫
          </span>

          <div>
            <strong>Flashcards</strong>
            <span>Generate and review</span>
          </div>
        </button>

      </div>

      <div className="overview-info-card">
        <h3>Suggested study flow</h3>

        <p>
          Upload your course materials, generate a summary,
          test yourself with quizzes, and reinforce important
          concepts with flashcards.
        </p>
      </div>
    </section>
  );
}

export default OverviewTab;