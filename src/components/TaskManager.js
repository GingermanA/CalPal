import React, { useState, useEffect } from "react";
import { Button, TextField, Checkbox } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import DeleteIcon from "@material-ui/icons/Delete";
import { DateTimePickerComponent } from "@syncfusion/ej2-react-calendars";
import { DropDownListComponent } from "@syncfusion/ej2-react-dropdowns";
// import Stack from "@material-ui/core/Stack";
import "./Scheduler.css";
import styles from "./TaskManager.module.css";
import fire from "../fire";
import { Link } from "react-router-dom";

// const useStyles = makeStyles((theme) => ({
//   formControl: {
//     margin: theme.spacing(1),
//     minWidth: 120,
//   },
//   selectEmpty: {
//     marginTop: theme.spacing(2),
//   },
//   container: {
//     display: "flex",
//     flexWrap: "wrap",
//   },
//   textField: {
//     marginLeft: theme.spacing(1),
//     marginRight: theme.spacing(1),
//     width: 200,
//   },
//   margin: {
//     margin: theme.spacing(1),
//   },
// }));

function TaskManager(props) {
  const { tasks, setTasks } = props; // tasks is an array of Objects
  const [overdueTasks, setOverdueTasks] = useState([]);
  // const classes = useStyles();
  const [moduleList, setModuleList] = useState([]);
  const [module, setModule] = React.useState("");
  const [newTitleText, setNewTitleText] = useState("");
  const [newDueDate, setNewDueDate] = useState(new Date());

  console.log(tasks);

  // this useEffect is to get the updated modules that a user adds
  useEffect(() => {
    const uid = fire.auth().currentUser?.uid;
    fire
      .firestore()
      .collection("Users")
      .doc(uid)
      .collection("Modules")
      .doc("My Modules")
      .get()
      .then((doc) => {
        if (doc.exists) {
          var modules = doc.data().modCode;
          var help = [];
          for (var i = 0; i < modules.length; i++) {
            if (modules[i] !== "") {
              help.push(modules[i]);
            }
          }
          setModuleList(help);
        } else {
        }
      });
  }, []);

  // this useEffect is to update what tasks are overdue
  useEffect(() => {
    const ot = [];
    console.log(tasks);
    if (tasks.length > 0) {
      for (var i = 0; i < tasks.length; i++) {
        try {
          let time = tasks[i].dueDate.seconds.toString() + "000";
          tasks[i].dueDate = new Date(parseInt(time));
        } catch (err) {}
        if (tasks[i].dueDate.getTime() < new Date()) {
          ot.push(tasks[i]);
        }
      }
      setOverdueTasks(ot);
    } else {
    }
  }, [tasks]);

  function handleAddTask(event) {
    // React honours default browser behavior and the
    // default behaviour for a form submission is to
    // submit AND refresh the page. So we override the
    // default behaviour here as we don't want to refresh
    // console.log(event);
    // const date = new Date(newDueDate);
    const date = new Date(newDueDate);
    console.log(date);
    event.preventDefault();
    const task = {
      Title: newTitleText,
      Module: module,
      dueDate: date,
      dueDateString: date.toString(),
      Type: "Task",
      isComplete: false,
    };
    // setNewTask(task);
    console.log(task);
    addTask(task, fire);
  }

  function addTask(task) {
    console.log(tasks);
    let length = tasks.length;
    try {
      for (let i = 0; i < length; i++) {
        let time = tasks[i].dueDate.seconds.toString() + "000";
        tasks[i].dueDate = new Date(parseInt(time));
      }
    } catch (err) {
      console.log("Its okay!");
    }
    const newTasks = [
      ...tasks,
      {
        ...task,
      },
    ];
    console.log(newTasks);
    const sortedTasks = newTasks.sort((a, b) => a.dueDate - b.dueDate); //sort the tasks by due date
    console.log(sortedTasks);
    setTasks(sortedTasks); // This works: tasks will be updated to sortedTasks
    function GuidFun() {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }

    function guid() {
      return (
        GuidFun() +
        GuidFun() +
        "-" +
        GuidFun() +
        "-4" +
        GuidFun().substr(0, 3) +
        "-" +
        GuidFun() +
        "-" +
        GuidFun() +
        GuidFun() +
        GuidFun()
      ).toLowerCase();
    }
    const uid = fire.auth().currentUser?.uid;
    const db = fire.firestore();
    const date = task.dueDate;
    const dateString = date.toString();
    const DocumentId = guid();
    db.collection("Users").doc(uid).collection("Tasks").doc(DocumentId).set({
      DocumentId: DocumentId,
      Title: task.Title,
      Module: task.Module,
      dueDate: date,
      dueDateString: dateString,
      Type: task.Type,
      isComplete: task.isComplete,
    });
  }

  return (
    <>
      <h2>Add Tasks</h2>
      {/* <FormControl className={classes.margin} onSubmit={handleAddTask}> */}
      <form className={styles.addTaskForm} onSubmit={handleAddTask}>
        {/* <Stack spacing={3}> */}
        <TextField
          className={styles.descTextField}
          label="Title"
          value={newTitleText}
          onChange={(event) => setNewTitleText(event.target.value)}
        />
        <td>
          <DropDownListComponent
            id="Module"
            className="e-field"
            dataSource={moduleList}
            placeholder="Select module"
            change={(event) => setModule(event.itemData.value)}
          ></DropDownListComponent>
        </td>
        <DateTimePickerComponent
          id="date"
          className="e-field"
          date-name="Due Date"
          format="dd/MM/yy hh:mm a"
          value={newDueDate}
          onChange={(event) => {
            setNewDueDate(event.target.value);
          }}
        ></DateTimePickerComponent>
        <Button type="submit" variant="contained" color="primary">
          Add
        </Button>
        {/* </FormControl> */}
        {/* </Stack> */}
      </form>
      <h2>Task List</h2>
      <h3>Overdue Tasks!</h3>
      {overdueTasks.length > 0 ? (
        <OverdueTaskList tasks={tasks} setTasks={setTasks} />
      ) : (
        <p>No overdue tasks!</p>
      )}
      <h3>Current Tasks</h3>
      {tasks.length > 0 ? (
        <TaskList tasks={tasks} setTasks={setTasks} />
      ) : (
        <p>No tasks yet! Add one above!</p>
      )}
    </>
  );
}

function TaskList(props) {
  const { tasks, setTasks } = props;
  function handleTaskCompletionToggled(toToggleTask, toToggleTaskIndex, event) {
    event.preventDefault();
    console.log(toToggleTask);
    const newTasks = [
      ...tasks.slice(0, toToggleTaskIndex),
      {
        ...toToggleTask,
        isComplete: !toToggleTask.isComplete,
      },
      ...tasks.slice(toToggleTaskIndex + 1),
    ];
    // We set new tasks in such a complex way so that we maintain immutability
    // Read this article to find out more:
    // https://blog.logrocket.com/immutability-in-react-ebe55253a1cc/
    setTasks(newTasks);
    const uid = fire.auth().currentUser?.uid;
    const db = fire.firestore();
    console.log(!toToggleTask.isComplete);
    const boolean = !toToggleTask.isComplete;
    db.collection("Users")
      .doc(uid)
      .collection("Tasks")
      .doc(toToggleTask.DocumentId)
      .update({
        isComplete: boolean,
      });
    const docRef = db.collection("Users").doc(uid).collection("Tasks");
    docRef.get().then((querySnapshot) => {
      const data = querySnapshot.docs.map((doc) => doc.data());
      setTasks(data);
    });
  }

  function isOverdue(task) {
    try {
      let time = tasks.dueDate.seconds.toString() + "000";
      task.dueDate = new Date(parseInt(time));
    } catch (err) {}
    if (task.dueDate < new Date()) {
      return true;
    }
  }

  function deleteTask(task, index) {
    const newTasks = [...tasks.slice(0, index), ...tasks.slice(index + 1)];
    setTasks(newTasks);
    const uid = fire.auth().currentUser?.uid;
    const db = fire.firestore();
    db.collection("Users")
      .doc(uid)
      .collection("Tasks")
      .doc(task.DocumentId)
      .delete();
    const docRef = db.collection("Users").doc(uid).collection("Tasks");
    docRef.get().then((querySnapshot) => {
      const data = querySnapshot.docs.map((doc) => doc.data());
      setTasks(data);
    });
  }

  return (
    <table style={{ margin: "0 auto", width: "100%", textAlign: "center" }}>
      <thead>
        <tr>
          <th>No.</th>
          <th>Task</th>
          <th>Module</th>
          <th>Due Date</th>
          <th>Completed</th>
          <th>Delete?</th>
          <th>Add to Scheduler</th>
        </tr>
      </thead>
      <tbody>
        {tasks
          .filter((task) => !isOverdue(task))
          .map((task, index) => (
            // We should specify key here to help react identify
            // what has updated
            // https://reactjs.org/docs/lists-and-keys.html#keys
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{task.Title}</td>
              <td>{task.Module}</td>
              <td>{task.dueDateString.slice(4, 21)}</td>
              <td>
                <Checkbox
                  color="primary"
                  checked={task.isComplete}
                  onChange={(event) =>
                    handleTaskCompletionToggled(task, index, event)
                  }
                  inputProps={{
                    "aria-label": `checkbox that determines if task ${index} is done`,
                  }}
                />
              </td>
              <td>
                <Button
                  onClick={() => deleteTask(task, index)}
                  startIcon={<DeleteIcon />}
                  color="secondary"
                ></Button>
              </td>
              <td>
                <Link
                  to={{
                    pathname: "/tasks/add",
                    state: task,
                  }}
                >
                  Add
                </Link>
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
}

function OverdueTaskList(props) {
  const { tasks, setTasks } = props;
  function isOverdue(task) {
    try {
      let time = tasks.dueDate.seconds.toString() + "000";
      task.dueDate = new Date(parseInt(time));
    } catch (err) {}
    if (task.dueDate < new Date()) {
      return true;
    }
  }
  function handleTaskCompletionToggled(toToggleTask, toToggleTaskIndex, event) {
    event.preventDefault();
    console.log(toToggleTask);
    const newTasks = [
      ...tasks.slice(0, toToggleTaskIndex),
      {
        ...toToggleTask,
        isComplete: !toToggleTask.isComplete,
      },
      ...tasks.slice(toToggleTaskIndex + 1),
    ];
    // We set new tasks in such a complex way so that we maintain immutability
    // Read this article to find out more:
    // https://blog.logrocket.com/immutability-in-react-ebe55253a1cc/
    setTasks(newTasks);
    const uid = fire.auth().currentUser?.uid;
    const db = fire.firestore();
    console.log(!toToggleTask.isComplete);
    const boolean = !toToggleTask.isComplete;
    db.collection("Users")
      .doc(uid)
      .collection("Tasks")
      .doc(toToggleTask.DocumentId)
      .update({
        isComplete: boolean,
      });
    const docRef = db.collection("Users").doc(uid).collection("Tasks");
    docRef.get().then((querySnapshot) => {
      const data = querySnapshot.docs.map((doc) => doc.data());
      setTasks(data);
    });
  }

  function deleteTask(task, index) {
    const newTasks = [...tasks.slice(0, index), ...tasks.slice(index + 1)];
    setTasks(newTasks);
    const uid = fire.auth().currentUser?.uid;
    const db = fire.firestore();
    db.collection("Users")
      .doc(uid)
      .collection("Tasks")
      .doc(task.DocumentId)
      .delete();
    const docRef = db.collection("Users").doc(uid).collection("Tasks");
    docRef.get().then((querySnapshot) => {
      const data = querySnapshot.docs.map((doc) => doc.data());
      setTasks(data);
    });
  }

  return (
    <table style={{ margin: "0 auto", width: "100%", textAlign: "center" }}>
      <thead>
        <tr>
          <th>No.</th>
          <th>Task</th>
          <th>Module</th>
          <th>Due Date</th>
          <th>Completed</th>
          <th>Delete?</th>
          <th>Add to Scheduler</th>
        </tr>
      </thead>
      <tbody>
        {tasks
          .filter((task) => isOverdue(task))
          .map((task, index) => (
            // We should specify key here to help react identify
            // what has updated
            // https://reactjs.org/docs/lists-and-keys.html#keys
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{task.Title}</td>
              <td>{task.Module}</td>
              <td>{task.dueDateString.slice(4, 21)}</td>
              <td>
                <Checkbox
                  color="primary"
                  checked={task.isComplete}
                  onChange={(event) =>
                    handleTaskCompletionToggled(task, index, event)
                  }
                  inputProps={{
                    "aria-label": `checkbox that determines if task ${index} is done`,
                  }}
                />
              </td>
              <td>
                <Button
                  onClick={() => deleteTask(task, index)}
                  startIcon={<DeleteIcon />}
                  color="secondary"
                ></Button>
              </td>
              <td>
                <Link
                  to={{
                    pathname: "/tasks/add",
                    state: task,
                  }}
                >
                  Add
                </Link>
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
}

export default TaskManager;
