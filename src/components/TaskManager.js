import React, { useState, useEffect } from "react";
import { Button, TextField, Checkbox } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
// import SimpleSelect from "./SimpleSelect";
import DatePickers from "./DatePickers";
import "./Scheduler.css";
//import Box from "../Box";

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
}));

function TaskManager(props) {
  const { tasks, setTasks } = props; // tasks is an array of Objects
  const classes = useStyles();
  // const [newTask, setNewTask] = useState({Title:'', Module:'', dueDate: null, Type: 'Task'});
  const [module, setModule] = React.useState('');
  const [newTitleText, setNewTitleText] = useState('');
  const [newDueDate, setNewDueDate] = useState('');

  const handleChange = (event) => {
    console.log(event.target.value);
    setModule(event.target.value);
  };
  // Our tasks and setTasks is now passed down from App
  

  function handleAddTask(event) {
    // React honours default browser behavior and the
    // default behaviour for a form submission is to
    // submit AND refresh the page. So we override the
    // default behaviour here as we don't want to refresh
    console.log(event);
    event.preventDefault();
    const task = {Title:newTitleText, Module:module, dueData: newDueDate, Type:'Task',isComplete: false}
    // setNewTask(task);
    // console.log(newTask);
    addTask(task, fire);
  }

  function addTask(task) {
    console.log(task);
    const newTasks = [
      // the ... operator is called the spread operator
      // what we are doing is creating a brand new array of
      // tasks, that is different from the previous array
      // See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax
      ...tasks,
      {
        ...task,
      },
    ];
    setTasks(newTasks);
    console.log(newTasks);
  }

  // function handleChange(event) {
  //   const value = event.target.value;
  //   setNewTask({...newTask, [event.target.name]: value});
  // }

  function GuidFun() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }

  useEffect(() => {
      const uid = fire.auth().currentUser?.uid;
      const db = fire.firestore();
      db.collection("Users")
    .doc(uid)
    .collection("Tasks").doc((
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
      ).toLowerCase()).set({ tasks });
    }, [tasks]);

  return (
    <>
      <h2>Add Tasks</h2>
      
      <form className={styles.addTaskForm} onSubmit={handleAddTask}>
        <TextField
          className={styles.descTextField}
          label="Title"
          value={newTitleText}
          onChange={(event) => setNewTitleText(event.target.value)}
        />
        <InputLabel id="demo-simple-select-label">Module</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={module}
          onChange={handleChange}
        ><MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
        {/* <DatePickers
          value={newTask.dueDate}
          onChange={(event) => setNewTask(event.target.value)}
        /> */}
        <Button type="submit" variant="contained" color="primary">
          Add
        </Button>
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

  function handleTaskCompletionToggled(toToggleTask, toToggleTaskIndex) {
    const newTasks = [
      // Once again, this is the spread operator
      ...tasks.slice(0, toToggleTaskIndex),
      {
        description: toToggleTask.description,
        isComplete: !toToggleTask.isComplete,
      },
      ...tasks.slice(toToggleTaskIndex + 1),
    ];
    // We set new tasks in such a complex way so that we maintain immutability
    // Read this article to find out more:
    // https://blog.logrocket.com/immutability-in-react-ebe55253a1cc/

    setTasks(newTasks);
  }

  return (
    <table style={{ margin: "0 auto", width: "100%" }}>
      <thead>
        <tr>
          <th>No.</th>
          <th>Task</th>
          <th>Completed</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map((task, index) => (
          // We should specify key here to help react identify
          // what has updated
          // https://reactjs.org/docs/lists-and-keys.html#keys
          <tr key={task.description}>
            <td>{index + 1}</td>
            <td>{task.description}</td>
            <td>
              <Checkbox
                color="primary"
                checked={task.isComplete}
                onChange={() => handleTaskCompletionToggled(task, index)}
                inputProps={{
                  "aria-label": `checkbox that determines if task ${index} is done`,
                }}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
export default TaskManager;
