import React, { useState } from "react";
import ReactDOM from "react-dom";
import { FaTrashAlt } from "react-icons/fa";
import { useProjectsValue, useSelectedProjectValue } from "../context";
import { db } from "../firebase";
import { deleteDoc, doc } from "firebase/firestore";

export const IndividualProject = ({ project }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const { projects, setProjects } = useProjectsValue();
  const { setSelectedProject } = useSelectedProjectValue();

  const deleteProject = async () => {
    try {
      // Delete project from Firestore
      await deleteDoc(doc(db, "projects", project.docId));

      // Update state by removing the deleted project
      const updatedProjects = projects.filter((p) => p.docId !== project.docId);
      setProjects(updatedProjects);

      // Reset selected project if the deleted project was active
      setSelectedProject("INBOX");

      // Close modal
      setShowConfirm(false);
    } catch (error) {
      alert("Error deleting project: " + error.message);
    }
  };

  return (
    <>
      <span className="sidebar__dot">•</span>
      <span className="sidebar__project-name">{project.name}</span>
      <span
        className="sidebar__project-delete"
        data-testid="delete-project"
        onClick={() => setShowConfirm(true)}
        onKeyDown={() => setShowConfirm(true)}
        tabIndex={0}
        aria-label="Confirm deletion of project"
        role="button"
      >
        <FaTrashAlt className="delete-project-icon" />
      </span>

      {/* React Portal: Move Modal Outside the Project List */}
      {showConfirm &&
        ReactDOM.createPortal(
          <>
            {/* Background Overlay (Click to Close) */}
            <div className="modal-overlay" onClick={() => setShowConfirm(false)} />

            {/* Delete Confirmation Modal */}
            <div className="project-delete-modal" role="dialog" aria-modal="true">
              <div className="project-delete-modal__inner">
                <p>Are you sure you want to delete this project?</p>
                <div className="modal-buttons">
                  <button className="delete-btn" onClick={deleteProject}>
                    Delete
                  </button>
                  <button className="cancel-btn" onClick={() => setShowConfirm(false)}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </>,
          document.getElementById("modal-root") // Ensure this exists in index.html
        )}
    </>
  );
};
