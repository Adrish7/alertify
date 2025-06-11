import { useState, useEffect } from "react";
import moment from "moment";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  getDocs,
} from "firebase/firestore";
import { db } from "../lib/firebase/firebase"; // Import your Firestore instance as 'db'
import { collatedTasksExist } from "../helpers";

export const useTasks = (selectedProject) => {
  const [tasks, setTasks] = useState([]);
  const [archivedTasks, setArchivedTasks] = useState([]);

  useEffect(() => {
    const tasksCollection = collection(db, "tasks");
    let tasksQuery = query(tasksCollection, where("userId", "==", "jA9mK3Hx"));

    if (selectedProject && !collatedTasksExist(selectedProject)) {
      tasksQuery = query(tasksQuery, where("projectId", "==", selectedProject));
    } else if (selectedProject === "TODAY") {
      tasksQuery = query(
        tasksQuery,
        where("date", "==", moment().format("DD/MM/YYYY"))
      );
    } else if (selectedProject === "INBOX" || selectedProject === 0) {
      tasksQuery = query(tasksQuery, where("date", "==", ""));
    }

    const unsubscribe = onSnapshot(tasksQuery, (snapshot) => {
      const newTasks = snapshot.docs.map((task) => ({
        id: task.id,
        ...task.data(),
      }));

      setTasks(
        selectedProject === "NEXT_7"
          ? newTasks.filter(
              (task) =>
                moment(task.date, "DD-MM-YYYY").diff(moment(), "days") <= 7 &&
                task.archived !== true
            )
          : newTasks.filter((task) => task.archived !== true)
      );

      setArchivedTasks(newTasks.filter((task) => task.archived === true));
    });

    return () => unsubscribe();
  }, [selectedProject]);

  return { tasks, archivedTasks };
};

export const useProjects = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const projectsCollection = collection(db, "projects");
    const projectsQuery = query(
      projectsCollection,
      where("userId", "==", "jA9mK3Hx"),
      orderBy("projectId")
    );

    getDocs(projectsQuery).then((snapshot) => {
      const allProjects = snapshot.docs.map((project) => ({
        ...project.data(),
        docId: project.id,
      }));

      // prevent an infinite loop of re-rendering
      if (JSON.stringify(allProjects) !== JSON.stringify(projects)) {
        setProjects(allProjects);
      }
    });
  }, [projects]);

  return { projects, setProjects };
};
