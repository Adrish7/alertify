import React, { useState, useEffect } from "react";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase/firebase";
import { FaBell } from "react-icons/fa";
import { Checkbox } from "./Checkbox";
import { useTasks } from "../hooks";
import { collatedTasks } from "../constants";
import { getTitle, getCollatedTitle, collatedTasksExist } from "../helpers";
import { useSelectedProjectValue, useProjectsValue } from "../context";
import { AddTask } from "./AddTask";
import { FaClock } from "react-icons/fa6";
import { BsCaretUpFill } from "react-icons/bs";
import { FaRegCalendarAlt } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, parse } from "date-fns";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";

export const Tasks = () => {
  // Dates
  const [showDatePicker, setShowDatePicker] = useState(null);
  const [selectedDates, setSelectedDates] = useState({});
  const [tempDate, setTempDate] = useState(null);

  // Tasks and Projects
  const { selectedProject } = useSelectedProjectValue();
  const { projects } = useProjectsValue();
  const { tasks } = useTasks(selectedProject);

  let projectName = "";
  const [showModal, setShowModal] = useState(null);

  // Reminder times
  const [reminderTimes, setReminderTimes] = useState({});
  const [tempTime, setTempTime] = useState("");

  if (
    projects.length > 0 &&
    projects &&
    selectedProject &&
    !collatedTasksExist(selectedProject)
  ) {
    projectName = getTitle(projects, selectedProject).name;
  }

  if (collatedTasksExist(selectedProject) && selectedProject) {
    projectName = getCollatedTitle(collatedTasks, selectedProject).name;
  }

  // Fetch saved dates from Firestore when tasks change
  useEffect(() => {
    const fetchDates = async () => {
      const updatedDates = {};
      for (const task of tasks) {
        const taskDocRef = doc(db, "tasks", task.id);
        const taskDocSnap = await getDoc(taskDocRef);
        if (taskDocSnap.exists()) {
          const storedDate = taskDocSnap.data().dueDate || "";
          updatedDates[task.id] = storedDate; // Store as dd/MM/yyyy (backend)
        }
      }
      setSelectedDates(updatedDates);
    };

    if (tasks.length > 0) {
      fetchDates();
    }
  }, [tasks]);

  const handleSaveDate = async (taskId, selectedDate) => {
    if (
      !selectedDate ||
      !(selectedDate instanceof Date) ||
      isNaN(selectedDate.getTime())
    ) {
      alert("Invalid date selected. Please choose a valid date.");
      return;
    }

    const formattedDate = format(selectedDate, "dd/MM/yyyy");

    setSelectedDates((prev) => ({
      ...prev,
      [taskId]: formattedDate, // Keep stored format
    }));

    try {
      const taskDocRef = doc(db, "tasks", taskId);
      await updateDoc(taskDocRef, { dueDate: formattedDate });
    } catch (error) {
      alert("Failed to save date. Please try again.");
    }
  };

  // Fetch reminder times from Firestore when tasks change
  useEffect(() => {
    const fetchReminders = async () => {
      const updatedReminders = {};
      for (const task of tasks) {
        const taskDocRef = doc(db, "tasks", task.id);
        const taskDocSnap = await getDoc(taskDocRef);
        if (taskDocSnap.exists()) {
          updatedReminders[task.id] = taskDocSnap.data().reminderTime || "";
        }
      }
      setReminderTimes(updatedReminders);
    };

    if (tasks.length > 0) {
      fetchReminders();
    }
  }, [tasks]);

  // Save Reminder Time
  const handleSaveReminder = async (taskId) => {
    setReminderTimes((prev) => ({
      ...prev,
      [taskId]: tempTime,
    }));
    setShowModal(null);

    try {
      const taskDocRef = doc(db, "tasks", taskId);
      await updateDoc(taskDocRef, { reminderTime: tempTime });
    } catch (error) {
      alert("Failed to save reminder. Please try again.");
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
                className="icon-bell"
                onClick={() => {
                  setShowModal(task.id);
                  setTempTime(reminderTimes[task.id] || "");
                }}
              />
              <FaClock className="icon-clock" />
              <FaRegCalendarAlt
                className="icon-calendar"
                onClick={() => setShowDatePicker(task.id)}
              />
              {reminderTimes[task.id] && (
                <span className="reminder-time">{reminderTimes[task.id]}</span>
              )}

              {selectedDates[task.id] && (
                <span className="task-date-box">
                  {format(
                    parse(selectedDates[task.id], "dd/MM/yyyy", new Date()),
                    "EEE d MMM"
                  )}
                </span>
              )}
            </div>

            {showModal === task.id && (
              <div className="reminder-modal">
                <BsCaretUpFill className="reminder-modal__arrow" />
                <div className="reminder-modal__header">Set Reminder</div>

                <div className="time-picker-container">
                  <TimePicker
                    onChange={setTempTime}
                    value={tempTime}
                    format="HH:mm" // 24-hour format
                    disableClock={true}
                    clearIcon={null}
                    className="custom-time-picker"
                  />
                </div>

                <div className="reminder-modal__actions">
                  <button
                    className="save-reminder-btn"
                    onClick={() => handleSaveReminder(task.id)}
                  >
                    Save
                  </button>
                  <button
                    className="cancel-reminder-btn"
                    onClick={() => setShowModal(null)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {showDatePicker === task.id && (
              <div className="date-picker-modal">
                <DatePicker
                  selected={
                    selectedDates[task.id]
                      ? new Date(
                          selectedDates[task.id].split("/").reverse().join("-")
                        )
                      : null
                  }
                  onChange={(selectedDate) => {
                    if (
                      selectedDate instanceof Date &&
                      !isNaN(selectedDate.getTime())
                    ) {
                      setTempDate(selectedDate);
                    } else {
                      alert("Invalid date selected.");
                    }
                  }}
                  dateFormat="dd/MM/yyyy"
                  inline
                />
                <div className="date-picker-modal__buttons">
                  <button
                    className="date-picker-modal__save"
                    onClick={() => {
                      handleSaveDate(task.id, tempDate);
                      setShowDatePicker(null);
                    }}
                  >
                    Save
                  </button>
                  <button
                    className="date-picker-modal__cancel"
                    onClick={() => setShowDatePicker(null)}
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
