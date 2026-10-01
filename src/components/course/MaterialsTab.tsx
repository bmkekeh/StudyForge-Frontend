import { useState } from "react";

import type {
  StudyMaterial,
} from "../../types/course";

type MaterialsTabProps = {
  courseId: number;
  materials: StudyMaterial[];
  setMaterials: React.Dispatch<
    React.SetStateAction<StudyMaterial[]>
  >;
};

function MaterialsTab({
  courseId,
  materials,
  setMaterials,
}: MaterialsTabProps) {
  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [uploading, setUploading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

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
     UPLOAD MATERIAL
  ========================= */

  const uploadMaterial = async () => {
    if (!selectedFile) {
      setError("Choose a file first.");
      return;
    }

    setUploading(true);
    setError("");
    setMessage("");

    const formData = new FormData();

    formData.append(
      "file",
      selectedFile,
    );

    try {
      const response = await fetch(
        `http://localhost:8080/courses/${courseId}/materials`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (!response.ok) {
        const text =
          await response.text();

        throw new Error(
          text ||
            "Failed to upload material.",
        );
      }

      setSelectedFile(null);

      setMessage(
        "Study material uploaded successfully.",
      );

      const fileInput =
        document.getElementById(
          "material-file",
        ) as HTMLInputElement | null;

      if (fileInput) {
        fileInput.value = "";
      }

      await loadMaterials();
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Could not upload material.",
      );
    } finally {
      setUploading(false);
    }
  };

  /* =========================
     DELETE MATERIAL
  ========================= */

  const deleteMaterial = async (
    materialId: number,
  ) => {
    const confirmed = window.confirm(
      "Delete this study material?",
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/courses/${courseId}/materials/${materialId}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        throw new Error(
          "Failed to delete material.",
        );
      }

      setMaterials((current) =>
        current.filter(
          (material) =>
            material.id !== materialId,
        ),
      );

      setMessage(
        "Study material deleted.",
      );

      setError("");
    } catch (err) {
      console.error(err);

      setError(
        "Could not delete the material.",
      );
    }
  };

  /* =========================
     UI
  ========================= */

  return (
    <section className="course-panel">

      <div className="panel-header">
        <div>
          <h2>
            Study Materials
          </h2>

          <p>
            Upload the files StudyForge
            should use to generate your
            study tools.
          </p>
        </div>

        <span className="panel-badge">
          {materials.length}{" "}
          {materials.length === 1
            ? "file"
            : "files"}
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
          UPLOAD
      ====================== */}

      <div className="upload-card">

        <div className="upload-copy">
          <h3>
            Add course material
          </h3>

          <p>
            Upload a PDF, text file,
            or another supported study
            document.
          </p>
        </div>

        <div className="upload-controls">

          <input
            id="material-file"
            type="file"
            onChange={(event) =>
              setSelectedFile(
                event.target.files?.[0] ||
                  null,
              )
            }
          />

          <button
            className="primary-course-button"
            onClick={uploadMaterial}
            disabled={uploading}
          >
            {uploading
              ? "Uploading..."
              : "Upload Material"}
          </button>

        </div>

      </div>

      {/* =====================
          MATERIAL LIST
      ====================== */}

      <div className="saved-section">

        <div className="saved-section-header">

          <h3>
            Uploaded Materials
          </h3>

          <span className="saved-count">
            {materials.length} total
          </span>

        </div>

        {materials.length === 0 ? (
          <div className="course-empty-state">

            <h3>
              No materials yet
            </h3>

            <p>
              Upload your first course
              document to start generating
              study tools.
            </p>

          </div>
        ) : (
          <div className="material-list">

            {materials.map(
              (material) => (
                <div
                  className="material-item"
                  key={material.id}
                >

                  <div className="material-main">

                    <div className="material-file-icon">
                      📄
                    </div>

                    <div>
                      <strong>
                        {material.fileName}
                      </strong>

                      <span>
                        Ready for StudyForge
                      </span>
                    </div>

                  </div>

                  <button
                    className="delete-material-button"
                    onClick={() =>
                      deleteMaterial(
                        material.id,
                      )
                    }
                  >
                    Delete
                  </button>

                </div>
              ),
            )}

          </div>
        )}

      </div>

    </section>
  );
}

export default MaterialsTab;