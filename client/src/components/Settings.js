import React, {useState} from "react";
import { CgDarkMode } from "react-icons/cg";
import { AddTask } from "./AddTask";

export const Settings = () => {
  const [shouldShowMain, setShouldShowMain] = useState(false);
  const [showQuickAddTask, setShowQuickAddTask] = useState(false);
  return(
    <div className="settings">
          <ul className="settings__generic">
            <li data-testid="quick-add-task-action" className="settings__add" >
              <button 
              aria-label="Quick Add Task"
              type="button" 
              onClick={() => {
              setShowQuickAddTask(true);
              setShouldShowMain(true);
            }}
            onKeyDown={() => {
              setShowQuickAddTask(true);
              setShouldShowMain(true);
            }}>
              +
              </button>
              </li>
            <li 
            data-testid="dark-mode-action" 
            className = "settings__darkmode" 
            >
              <button type="button" 
              aria-label="Dark Mode on/off"
              onClick={() => setDarkMode(!darkMode)}
              onKeyDown={() => setDarkMode(!darkMode)}>
              <CgDarkMode />
              </button>
              
            </li>
          </ul>
          <AddTask showAddTaskMain={false} shouldShowMain={shouldShowMain} showQuickAddTask={showQuickAddTask} setShowQuickAddTask={setShowQuickAddTask}/>
        </div>
  
  ) 
  
};