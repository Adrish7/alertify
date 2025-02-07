import React, {useState} from "react";
import { db } from "../firebase";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { generatePushId } from "../helpers";
import { useProjectsValue } from "../context";



export const AddProject = ({shouldShow = false}) => {

  const [show, setShow] = useState(shouldShow);
  const [projectName, setProjectName] = useState('');
  const projectId = generatePushId();
  const {setProjects} = useProjectsValue();

  const addProject = async () => {
    if (projectName) {
      try {
        await addDoc(collection(db, "projects"), {
          projectId,
          name: projectName,
          userId: "jA9mK3Hx",
        });
  
        // Fetch updated projects
        const querySnapshot = await getDocs(collection(db, "projects"));
        const updatedProjects = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          docId: doc.id,
        }));
  
        setProjects(updatedProjects); // Update state with the new list
        setProjectName("");
        setShow(false);
      } catch (error) {
        alert("Error adding project: ", error);
      }
    }
  };

  return (
    <div className = "add-project" data-testid="add-project">
      {show && (
        <div className="add-project__input">
          <input value={projectName} onChange={e => setProjectName(e.target.value)} className="add-project__name" data-testid="project-name" type="text" placeholder="Name your project"
          onKeyDown={(e) => {
            if (e.key === "Enter") addProject();
          }}
          />
          <button className="add-project__submit" type="button" onClick={() => addProject()} data-testid="add-project-submit">Add Project</button>
          <span 
          className="add-project__cancel" 
          aria-label="Cancel adding project"
          data-testid="hide-project-overlay" 
          onClick={() => setShow(false)} 
          onKeyDown={() => setShow(false)} 
          role="button" 
          tabIndex={0}
          > Cancel</span>
        </div>)}
        <span className="add-project__plus"
        onClick={() => setShow(!show)} 
        onKeyDown={() => setShow(!show)} 
        role="button" 
        tabIndex={0}
        >+</span>
        <span 
        aria-label="Add Project"
        className="add-project__text" 
        data-testid="add-project-action" 
        onClick={() => setShow(!show)} 
        onKeyDown={() => setShow(!show)} 
        role="button" 
        tabIndex={0}
        >Add Project</span>
    </div>
  )
};