import React from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase"; // Import Firestore instance

export const Checkbox = ({ id }) => {
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
    >
      <span className="checkbox" />
    </div>
  );
};


