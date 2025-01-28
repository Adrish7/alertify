import React, { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { FaBell } from "react-icons/fa";
import { Checkbox } from "./Checkbox";
import { useTasks } from "../hooks";
import { collatedTasks } from "../constants";
import { getTitle, getCollatedTitle, collatedTasksExist } from "../helpers";
import { useSelectedProjectValue, useProjectsValue } from "../context";
import { AddTask } from "./AddTask";

export const Tasks = () => {
  const { selectedProject } = useSelectedProjectValue();
  const { projects } = useProjectsValue();
  const { tasks } = useTasks(selectedProject);

  let projectName = "";
  const [showModal, setShowModal] = useState(null); // To toggle modal per task
  const [reminderTimes, setReminderTimes] = useState({}); // Store reminder times per task
  const [tempTime, setTempTime] = useState(""); // Temporary state for the time picker

  if (projects.length > 0 && projects && selectedProject && !collatedTasksExist(selectedProject)) {
    projectName = getTitle(projects, selectedProject).name;
  }

  if (collatedTasksExist(selectedProject) && selectedProject) {
    projectName = getCollatedTitle(collatedTasks, selectedProject).name;
  }

  const handleSaveReminder = async (taskId) => {
    setReminderTimes((prev) => ({
      ...prev,
      [taskId]: tempTime,
    }));
    setShowModal(null); // Close modal

    try {
      const taskDocRef = doc(db, "tasks", taskId);
      await updateDoc(taskDocRef, {
        reminderTime: tempTime,
      });
      console.log(`Saved reminder for task ${taskId}: ${tempTime}`);
    } catch (error) {
      console.error("Error saving reminder:", error.message);
    }
  };

  return (
    <div className="tasks" data-testid="tasks">
      <h2 data-testid="project-name">{projectName}</h2>

      <ul className="tasks__list">
        {tasks.map((task) => (
          <li key={task.id} className="task-item">
            <div className="task-content">
              <Checkbox id={task.id} taskDesc={task.task} />
              <span>{task.task}</span>
            </div>
            <div className="task-icons">
              <FaBell
                className="icon icon-bell"
                onClick={() => {
                  setShowModal(task.id); // Open modal for this task
                  setTempTime(reminderTimes[task.id] || ""); // Load saved time into the picker
                }}
              />
              {reminderTimes[task.id] && (
                <span className="reminder-time">{reminderTimes[task.id]}</span> // Show saved reminder
              )}
            </div>

            {showModal === task.id && (
              <div className="reminder-modal">
                <div className="reminder-modal__header">Set Reminder</div>
                <div className="time-picker-container">
                  <input
                    type="time"
                    value={tempTime}
                    onChange={(e) => setTempTime(e.target.value)} // Update temporary state
                  />
                  <button onClick={() => handleSaveReminder(task.id)}>Save</button>
                </div>
                <div className="reminder-modal__actions">
                  <button
                    className="cancel-btn"
                    onClick={() => setShowModal(null)} // Close modal
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
      <AddTask />
    </div>
  );
};
