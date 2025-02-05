import React, {useState} from "react";
import { FaChevronDown, FaInbox, FaRegCalendarAlt, FaRegCalendar } from "react-icons/fa";
import { Projects } from "../Projects";
import { useSelectedProjectValue } from "../../context";
import { AddProject } from "../AddProject";
import { CgDarkMode } from "react-icons/cg";
import { AddTask } from "../AddTask";
import { IoSettingsOutline } from "react-icons/io5";



function Sidebar() {
  const {setSelectedProject} = useSelectedProjectValue();
  const [active, setActive] = useState('inbox');
  const [showProjects, setShowProjects] = useState(true);
 
  return (
    <div className="sidebar" data-testid="sidebar">
      <div className="sidebar-header">
      <IoSettingsOutline className="settings-icon"/>
      <div className = "logo">
          <img src="/images/logo.png" alt="Logo" />
      </div>
      </div>
      <ul className="sidebar__generic">
        <li data-testid="inbox" className={active === 'inbox' ? 'active':undefined}>
        <div
        aria-label="Show inbox tasks"
        tabIndex={0}
        role="button"
        onClick={() => {
          setActive('inbox');
          setSelectedProject('INBOX');
        }}
        onKeyDown={() => {
          setActive('inbox');
          setSelectedProject('INBOX');
        }}
        >
        <span><FaInbox></FaInbox></span>
        <span>Inbox</span>
        </div>
        </li>
        <li data-testid="today" className={active === 'today' ? 'active':undefined}>
        <div
        aria-label="Show today's tasks"
        tabIndex={0}
        role="button"
        onClick={() => {
          setActive('today');
          setSelectedProject('TODAY');
        }}
        onKeyDown={() => {
          setActive('today');
          setSelectedProject('TODAY');
        }}
        >
        <span><FaRegCalendar></FaRegCalendar></span>
        <span>Today</span>
        </div>
        </li>
        <li data-testid="next_7" className={active === 'next_7' ? 'active':undefined}  onClick={() => {
          setActive('next_7');
          setSelectedProject('NEXT_7');
        }}>
        <div 
        aria-label="Show tasks for the next 7 days"
        tabIndex={0}
        role="button"
        onClick={() => {
          setActive('next_7');
          setSelectedProject('NEXT_7');
        }}
        onKeyDown={() => {
          setActive('next_7');
          setSelectedProject('NEXT_7');
        }}
        >
        <span><FaRegCalendarAlt /></span>
        <span>Next 7 days</span>
        </div>
        </li>
        
      </ul>
      <div 
      className="sidebar__middle" 
      aria-label="Show/Hide projects"
      onClick={() => setShowProjects(!showProjects)}
      onKeyDown={() => setShowProjects(!showProjects)}
      role="button"
      tabIndex={0}
      >
        <span>
          <FaChevronDown 
          className={!showProjects ? 'hidden-projects' : undefined} />
          </span>
        <h2>Projects</h2>
    </div>

    <ul className="sidebar__projects">{showProjects && <Projects/>}</ul>
    {showProjects && <AddProject/>}
    
  </div>
  
  
  );
}

export default Sidebar;