import React, { useState, useEffect } from "react";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { FaBell } from "react-icons/fa";
import { Checkbox } from "./Checkbox";
import { useTasks } from "../hooks";
import { collatedTasks } from "../constants";
import { getTitle, getCollatedTitle, collatedTasksExist } from "../helpers";
import { useSelectedProjectValue, useProjectsValue } from "../context";
import { AddTask } from "./AddTask";
import { FaClock } from "react-icons/fa6";
import { BsCaretUpFill } from "react-icons/bs";



export const Tasks = () => {
  const { selectedProject } = useSelectedProjectValue();
  const { projects } = useProjectsValue();
  const { tasks } = useTasks(selectedProject);

  let projectName = "";
  const [showModal, setShowModal] = useState(null);
  const [reminderTimes, setReminderTimes] = useState({});
  const [tempTime, setTempTime] = useState("");

  if (projects.length > 0 && projects && selectedProject && !collatedTasksExist(selectedProject)) {
    projectName = getTitle(projects, selectedProject).name;
  }

  if (collatedTasksExist(selectedProject) && selectedProject) {
    projectName = getCollatedTitle(collatedTasks, selectedProject).name;
  }

  // Fetch reminder times from Firestore when tasks change
  useEffect(() => {
    const fetchReminders = async () => {
      const updatedReminders = {};
      for (const task of tasks) {
        const taskDocRef = doc(db, "tasks", task.id);
        const taskDocSnap = await getDoc(taskDocRef);
        if (taskDocSnap.exists()) {
          updatedReminders[task.id] = taskDocSnap.data().reminderTime || ""; // Get reminder time or default to empty
        }
      }
      setReminderTimes(updatedReminders);
    };

    if (tasks.length > 0) {
      fetchReminders();
    }
  }, [tasks]); // Re-fetch when tasks change

  const handleSaveReminder = async (taskId) => {
    setReminderTimes((prev) => ({
      ...prev,
      [taskId]: tempTime,
    }));
    setShowModal(null);

    try {
      const taskDocRef = doc(db, "tasks", taskId);
      await updateDoc(taskDocRef, { reminderTime: tempTime });
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
                  setShowModal(task.id);
                  setTempTime(reminderTimes[task.id] || "");
                }}
              />
              <FaClock className="icon icon-clock" />
              <div>
              {reminderTimes[task.id] && (
                <span className="reminder-time">{reminderTimes[task.id]}</span>
              )}
              </div>
            </div>
            

            {showModal === task.id && (
              <div className="reminder-modal">
               <BsCaretUpFill className="reminder-modal__arrow" />
                <div className="reminder-modal__header">Set Reminder</div>
                <div className="time-picker-container">
                  <input
                    type="time"
                    value={tempTime}
                    onChange={(e) => setTempTime(e.target.value)}
                  />
                  <button onClick={() => handleSaveReminder(task.id)}>Save</button>
                </div>
                <div className="reminder-modal__actions">
                  <button className="cancel-btn" onClick={() => setShowModal(null)}>
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
