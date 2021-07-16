import React, { useState, useEffect } from "react";
import { Button, TextField, Checkbox } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import DeleteIcon from "@material-ui/icons/Delete";
import { DateTimePickerComponent } from "@syncfusion/ej2-react-calendars";
import { DropDownListComponent } from "@syncfusion/ej2-react-dropdowns";
import "./Scheduler.css";
import styles from "./TaskManager.module.css";
import fire from "../fire";
import { Link } from "react-router-dom";

function TaskManager(props) {
  const { tasks, setTasks } = props; // tasks is an array of Objects
  const [overdueTasks, setOverdueTasks] = useState([]);
  const [numberOfOtTasks, setNumberOfOtTasks] = useState(0);
  // const classes = useStyles();
  const [moduleList, setModuleList] = useState([]);
  const [module, setModule] = React.useState("");
  const [newTitleText, setNewTitleText] = useState("");
  const [newDueDate, setNewDueDate] = useState(new Date());
  const [filter, setFilter] = useState("");

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
      setNumberOfOtTasks(ot.length);
    } else {
    }
  }, [tasks]);

  function handleAddTask(event) {
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
    const date = new Date(newDueDate);
    console.log(date);
    event.preventDefault();
    const DocumentId = guid();
    const task = {
      DocumentId: DocumentId,
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

    const uid = fire.auth().currentUser?.uid;
    const db = fire.firestore();
    const date = task.dueDate;
    const dateString = date.toString();

    db.collection("Users")
      .doc(uid)
      .collection("Tasks")
      .doc(task.DocumentId)
      .set({
        DocumentId: task.DocumentId,
        Title: task.Title,
        Module: task.Module,
        dueDate: date,
        dueDateString: dateString,
        Type: task.Type,
        isComplete: task.isComplete,
      });
  }

  function search(rows) {
    return rows.filter(
      (row) =>
        row.Module.toLowerCase().indexOf(filter) > -1 ||
        row.Module.indexOf(filter) > -1
    );
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

  return (
    <div className={styles.split}>
      <div className={styles.left}>
        <div className={styles.formWrap}>
          <h2>Add Tasks</h2>
          {/* <FormControl className={classes.margin} onSubmit={handleAddTask}> */}
          <form className={styles.addTaskForm} onSubmit={handleAddTask}>
            {/* <Stack spacing={3}> */}
            <div>
              Title
              <TextField
                className={styles.descTextField}
                //label=""
                value={newTitleText}
                onChange={(event) => setNewTitleText(event.target.value)}
              />
            </div>
            <div className={styles.blankSpace}></div>
            <div>
              Module
              <DropDownListComponent
                id="Module"
                className="e-field"
                dataSource={moduleList}
                placeholder="Select module"
                change={(event) => setModule(event.itemData.value)}
              ></DropDownListComponent>
            </div>
            <div className={styles.blankSpace}></div>
            <div>
              Due Date
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
            </div>
            <div className={styles.blankSpace2}></div>
            <Button type="submit" variant="contained" color="primary">
              Add
            </Button>
            {/* </FormControl> */}
            {/* </Stack> */}
          </form>
        </div>
      </div>
      <div className={styles.right}>
        <h2>Task List</h2>
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <h3>Overdue Tasks!</h3>
        {overdueTasks.length > 0 ? (
          <OverdueTaskList tasks={search(tasks)} setTasks={setTasks} />
        ) : (
          <p>No overdue tasks!</p>
        )}
        <h3>Current Tasks</h3>
        {tasks.filter((task) => !isOverdue(task)).length > 0 ? (
          <TaskList
            tasks={search(tasks)}
            setTasks={setTasks}
            numberOfOtTasks={numberOfOtTasks}
          />
        ) : (
          <p>No tasks yet! Add one above!</p>
        )}
      </div>
    </div>
  );
}

function TaskList(props) {
  const { tasks, setTasks, numberOfOtTasks } = props;

  function handleTaskCompletionToggled(toToggleTask, toToggleTaskIndex, event) {
    event.preventDefault();
    console.log(tasks);
    const helper = !toToggleTask.isComplete;
    delete toToggleTask["isComplete"];
    console.log(toToggleTask, toToggleTaskIndex);
    console.log(helper);
    const newTasks = [
      ...tasks.slice(0, toToggleTaskIndex),
      {
        ...toToggleTask,
        isComplete: helper,
      },
      ...tasks.slice(toToggleTaskIndex + 1),
    ];
    console.log(newTasks);
    const sortedTasks = newTasks.sort((a, b) => a.dueDate - b.dueDate); //sort the tasks by due date
    console.log(sortedTasks);
    setTasks(sortedTasks);
    const uid = fire.auth().currentUser?.uid;
    const db = fire.firestore();

    const boolean = helper;
    db.collection("Users")
      .doc(uid)
      .collection("Tasks")
      .doc(toToggleTask.DocumentId)
      .update({
        isComplete: boolean,
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

  function numberOfOverdueTasks() {
    return numberOfOtTasks;
  }

  function deleteTask(task, index) {
    console.log(index);
    const newTasks = [...tasks.slice(0, index), ...tasks.slice(index + 1)];
    console.log(newTasks);
    const sortedTasks = newTasks.sort((a, b) => a.dueDate - b.dueDate); //sort the tasks by due date
    console.log(sortedTasks);
    setTasks(sortedTasks);
    const uid = fire.auth().currentUser?.uid;
    const db = fire.firestore();
    db.collection("Users")
      .doc(uid)
      .collection("Tasks")
      .doc(task.DocumentId)
      .delete();
  }

  return (
    <table
      className={styles.tasks}
      style={{
        margin: "0 auto",
        width: "100%",
        textAlign: "center",
        tableLayout: "fixed",
      }}
    >
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
            <tr key={index}>
              <td>{index + numberOfOverdueTasks() + 1}</td>
              <td>{task.Title}</td>
              <td>{task.Module}</td>
              <td>{task.dueDateString.slice(4, 21)}</td>
              <td>
                <Checkbox
                  color="primary"
                  checked={task.isComplete}
                  onChange={(event) =>
                    handleTaskCompletionToggled(
                      task,
                      index + numberOfOverdueTasks(),
                      event
                    )
                  }
                  inputProps={{
                    "aria-label": `checkbox that determines if task ${index} is done`,
                  }}
                />
              </td>
              <td>
                <Button
                  onClick={() =>
                    deleteTask(task, index + numberOfOverdueTasks())
                  }
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
    console.log(tasks);
    const helper = !toToggleTask.isComplete;
    delete toToggleTask["isComplete"];
    console.log(toToggleTask, toToggleTaskIndex);
    console.log(helper);
    const newTasks = [
      ...tasks.slice(0, toToggleTaskIndex),
      {
        ...toToggleTask,
        isComplete: helper,
      },
      ...tasks.slice(toToggleTaskIndex + 1),
    ];
    console.log(newTasks);
    const sortedTasks = newTasks.sort((a, b) => a.dueDate - b.dueDate); //sort the tasks by due date
    console.log(sortedTasks);
    setTasks(sortedTasks);
    const uid = fire.auth().currentUser?.uid;
    const db = fire.firestore();

    const boolean = helper;
    db.collection("Users")
      .doc(uid)
      .collection("Tasks")
      .doc(toToggleTask.DocumentId)
      .update({
        isComplete: boolean,
      });
  }

  function deleteTask(task, index) {
    const newTasks = [...tasks.slice(0, index), ...tasks.slice(index + 1)];
    const sortedTasks = newTasks.sort((a, b) => a.dueDate - b.dueDate); //sort the tasks by due date
    setTasks(sortedTasks);
    const uid = fire.auth().currentUser?.uid;
    const db = fire.firestore();
    db.collection("Users")
      .doc(uid)
      .collection("Tasks")
      .doc(task.DocumentId)
      .delete();
  }

  return (
    <table
      className={styles.tasks}
      style={{
        margin: "0 auto",
        width: "100%",
        textAlign: "center",
        tableLayout: "fixed",
      }}
    >
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
