import { useState, useEffect } from "react";
import TaskManager from "./TaskManager";
import styles from "./PageTodolist.module.css";
import SideNavTasks from "./SideNavTasks";
import fire from "../fire";

function PageTodolist() {
  // console.log(props.selectedIndex);
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
    const docRef = db.collection("Users").doc(uid).collection("Tasks");
    docRef.get().then((querySnapshot) => {
      const data = querySnapshot.docs
        .map((doc) => doc.data())
        .sort((a, b) => a.dueDate - b.dueDate);
      setTasksState(data);
    });
  }, []);

  return (
    <div className={styles.root}>
      <SideNavTasks />
      <main className={styles.content}>
        <TaskManager tasks={tasks} setTasks={setTasks} />
      </main>
    </div>
  );
}

export default PageTodolist;
