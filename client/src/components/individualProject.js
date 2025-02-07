import React, {useState} from "react";
import { FaTrashAlt } from "react-icons/fa";
import { useProjectsValue, useSelectedProjectValue } from "../context";
import { db } from "../firebase";
import {deleteDoc, doc} from "firebase/firestore";
export const IndividualProject = ({project}) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const {projects, setProjects} = useProjectsValue();
  const {setSelectedProject} = useSelectedProjectValue();
  // delete a project with new firebase v9

  const deleteProject = async (docId) => {
    try {
      const projectDocRef = doc(db, 'projects', docId); // Reference to the document
      await deleteDoc(projectDocRef); // Delete the document
      setProjects([...projects]); // Update the projects state
      setSelectedProject('INBOX'); // Set the selected project to 'INBOX'
    } catch (error) {
      alert("Error deleting project: ", error);
    }
  };


  return(
    <>
      <span className="sidebar__dot">•</span>
      <span className="sidebar__project-name">{project.name}</span>
      <span
        className="sidebar__project-delete"
        data-testid="delete-project"
        onClick={() => setShowConfirm(!showConfirm)}
        onKeyDown={() => setShowConfirm(!showConfirm)}
        tabIndex={0}
        aria-label="Confirm deletion of project"
        role="button"
      >
        <FaTrashAlt />
        {showConfirm && (
          <div className="project-delete-modal">
            <div className="project-delete-modal__inner">
              <p>Are you sure you want to delete this project?</p>
              <button
                type="button"
                onClick={() => deleteProject(project.docId)}
              >
                Delete
              </button>
              <span
                onClick={() => setShowConfirm(!showConfirm)}
                onKeyDown={() => setShowConfirm(!showConfirm)}
                tabIndex={0}
                role="button"
                aria-label="Cancel adding project, do not delete"
              >
                Cancel
              </span>
            </div>
          </div>
        )}
      </span>
    </>
  )
}