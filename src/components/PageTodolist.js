import { useState, useEffect } from "react";

//import Header from "../components/Header";
import TaskManager from "./TaskManager";
import { Link } from "react-router-dom";

import fire from "../fire";

function PageTodolist() {
  // Task state has to be lifted to be at the App level
  // because Header also needs to know the task state to display
  // no. of undone tasks. It cannot be contained within TaskManager
  // as child components cannot pass props to their parent components.
  const [tasks, setTasksState] = useState([]);

  function setTasks(newTasks) {
    setTasksState(newTasks);
  }

  useEffect(() => {
    const uid = fire.auth().currentUser?.uid;
    const db = fire.firestore();
    const docRef = db
    .collection("Users")
    .doc(uid)
    .collection("Tasks");
    
    docRef
    .get()
    .then((querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => doc.data());
      setTasksState(data);
        });
  }, [])

  return (
    <main>
      <Link to="/scheduler">Scheduler</Link>
      <TaskManager tasks={tasks} setTasks={setTasks} />
    </main>
  );
}

export default PageTodolist;
