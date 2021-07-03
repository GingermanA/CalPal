import React, { useState, useEffect } from "react";
import { Button, TextField, Checkbox } from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import DeleteIcon from "@material-ui/icons/Delete";
import Input from "@material-ui/core/Input";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import "./Scheduler.css";
import styles from "./TaskManager.module.css";
import fire from "../fire";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  container: {
    display: "flex",
    flexWrap: "wrap",
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
}));

function TaskManager(props) {
  const { tasks, setTasks } = props; // tasks is an array of Objects
  const classes = useStyles();
  // const [newTask, setNewTask] = useState({Title:'', Module:'', dueDate: null, Type: 'Task'});
  const [moduleList, setModuleList] = useState([]);
  const [module, setModule] = React.useState("");
  const [newTitleText, setNewTitleText] = useState("");
  const [newDueDate, setNewDueDate] = useState(new Date());

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

  function handleAddTask(event) {
    // React honours default browser behavior and the
    // default behaviour for a form submission is to
    // submit AND refresh the page. So we override the
    // default behaviour here as we don't want to refresh
    // console.log(event);
    const date = new Date(newDueDate);
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
    const newTasks = [
      ...tasks,
      {
        ...task,
      },
    ];
    setTasks(newTasks); // This works: tasks will be updated to newTasks
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

  // function handleChange(event) {
  //   const value = event.target.value;
  //   setNewTask({...newTask, [event.target.name]: value});
  // }

  return (
    <>
      <h2>Add Tasks</h2>
      {/* <FormControl className={classes.formControl} onSubmit={handleAddTask}> */}
      <form className={styles.addTaskForm} onSubmit={handleAddTask}>
        <TextField
          className={styles.descTextField}
          label="Title"
          value={newTitleText}
          onChange={(event) => setNewTitleText(event.target.value)}
        />
        <InputLabel id="demo-simple-select-outlined-label">Module</InputLabel>
        <Select
          labelId="demo-simple-select-outlined-label"
          id="demo-simple-select-outlined"
          value={module}
          label="Module"
        >
          {moduleList.map((mod) => (
            <MenuItem key={mod} onClick={() => setModule(mod)}>
              {mod}
            </MenuItem>
          ))}
        </Select>
        {/* <InputLabel id="demo-simple-select-label">Module</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={module}
          onChange={(event) => setModule(event.target.value)}
        >
          <MenuItem value={"CS1010S"}>CS1010S</MenuItem>
          <MenuItem value={"MA1521"}>MA1521</MenuItem>
          <MenuItem value={"IS1103"}>IS1103</MenuItem>
        </Select> */}
        <TextField
          id="date"
          label="Due Date"
          type="datetime-local"
          className={classes.textField}
          InputLabelProps={{
            shrink: true,
          }}
          value={newDueDate}
          onChange={(event) => {
            setNewDueDate(event.target.value);
            console.log(event.target.value);
            console.log(newDueDate);
          }}
        />
        <Button type="submit" variant="contained" color="primary">
          Add
        </Button>
        {/* </FormControl> */}
      </form>
      <h2>Task List</h2>
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
        </tr>
      </thead>
      <tbody>
        {tasks.map((task, index) => (
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
          </tr>
        ))}
      </tbody>
    </table>
  );
}
export default TaskManager;
