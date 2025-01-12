import React from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase"; // Import Firestore instance

export const Checkbox = ({ id, taskDesc }) => {
  const archiveTask = async () => {
    const taskRef = doc(db, "tasks", id); // Reference to the specific document
    await updateDoc(taskRef, {
      archived: true,
    });
  };

  return (
    <div
      className="checkbox-holder"
      data-testid="checkbox-action"
      onClick={() => archiveTask()} // Call archiveTask on click
      onKeyDown={() => archiveTask()} // Call archiveTask on keydown
      aria-label={`Mark ${taskDesc} as done?`}
      role="button"
      tabIndex={0}
    >
      <span className="checkbox" />
    </div>
  );
};


