import React from "react";
import { IconButton, Button, TextField } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { DateTimePickerComponent } from "@syncfusion/ej2-react-calendars";
import { DropDownListComponent } from "@syncfusion/ej2-react-dropdowns";
import styles from "./EditorWindow.module.css";
import fire from "../fire";
import ClearIcon from "@material-ui/icons/Clear";

export default function EditorWindow(props) {
  const { editedTask, moduleList, tasks, setTasks } = props;
  const [module, setModule] = React.useState(editedTask.Module);
  const [newTitleText, setNewTitleText] = React.useState(editedTask.Title);
  const [newDueDate, setNewDueDate] = React.useState(editedTask.dueDate);

  // task={task}
  // moduleList={moduleList}
  // newTitleText={newTitleText}
  // setNewTitleText={setNewTitleText}
  // setNewDueDate={setNewDueDate}
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setNewTitleText(editedTask.Title);
    setModule(editedTask.Module);
    setNewDueDate(editedTask.dueDate);
    setOpen(true);
    console.log(newTitleText);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function handleAddTask(event) {
    // function GuidFun() {
    //   return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    // }
    // function guid() {
    //   return (
    //     GuidFun() +
    //     GuidFun() +
    //     "-" +
    //     GuidFun() +
    //     "-4" +
    //     GuidFun().substr(0, 3) +
    //     "-" +
    //     GuidFun() +
    //     "-" +
    //     GuidFun() +
    //     GuidFun() +
    //     GuidFun()
    //   ).toLowerCase();
    // }
    const date = new Date(newDueDate);
    event.preventDefault();
    // const DocumentId = guid();
    // const task = {
    //   DocumentId: DocumentId,
    //   Title: newTitleText,
    //   Module: module,
    //   dueDate: date,
    //   dueDateString: date.toString(),
    //   Type: "Task",
    //   isComplete: false,
    // };
    // setNewTask(task);
    // console.log(task);

    editTask(editedTask, newTitleText, module, date, fire); //task is old task

    // const uid = fire.auth().currentUser?.uid;
    // const db = fire.firestore();
    // db.collection("Users")
    //   .doc(uid)
    //   .collection("Tasks")
    //   .doc(editedTask.DocumentId)
    //   .delete();
    handleClose();
  }

  function editTask(task, newTitleText, module, date) {
    // console.log(tasks);
    const uid = fire.auth().currentUser?.uid;
    const db = fire
      .firestore()
      .collection("Users")
      .doc(uid)
      .collection("Tasks")
      .doc(task.DocumentId);
    const dateString = date.toString();

    db.update({ Title: newTitleText });
    db.update({ Module: module });
    db.update({ dueDate: date });
    db.update({ dueDateString: dateString });

    let length = tasks.length;
    try {
      for (let i = 0; i < length; i++) {
        let time = tasks[i].dueDate.seconds.toString() + "000";
        tasks[i].dueDate = new Date(parseInt(time));
      }
    } catch (err) {
      // console.log("Its okay!");
    }

    const copyTasks = [...tasks];
    for (var i = 0; i < length; i++) {
      if (tasks[i].DocumentId === task.DocumentId) {
        copyTasks[i].Title = newTitleText;
        copyTasks[i].Module = module;
        copyTasks[i].dueDate = date;
        copyTasks[i].dueDateString = dateString;
        break;
      }
    }
    const sortedTasks = copyTasks.sort((a, b) => a.dueDate - b.dueDate);
    setTasks(sortedTasks);
    console.log(sortedTasks);
    console.log(tasks);

    // const newTasks = [
    //   ...tasks,
    //   {
    //     ...task,
    //   },
    // ];
    // console.log(newTasks);
    // const sortedTasks = newTasks.sort((a, b) => a.dueDate - b.dueDate); //sort the tasks by due date
    // console.log(sortedTasks);
    // setTasks(sortedTasks); // This works: tasks will be updated to sortedTasks

    // const uid = fire.auth().currentUser?.uid;
    // const db = fire.firestore();
    // const date = task.dueDate;
    // const dateString = date.toString();

    // db.collection("Users")
    //   .doc(uid)
    //   .collection("Tasks")
    //   .doc(task.DocumentId)
    //   .set({
    //     DocumentId: task.DocumentId,
    //     Title: task.Title,
    //     Module: task.Module,
    //     dueDate: date,
    //     dueDateString: dateString,
    //     Type: task.Type,
    //     isComplete: task.isComplete,
    //   });
  }

  return (
    <div>
      <Button
        style={{ backgroundColor: "#0066ff" }}
        variant="contained"
        onClick={handleClickOpen}
      >
        Edit
      </Button>
      <Dialog open={open} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">
          <div className={styles.editorHeader}>Edit Task</div>
          <div className={styles.editorClose}>
            <IconButton onClick={handleClose}>
              <ClearIcon />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent>
          {/* <DialogContentText>
            To subscribe to this website, please enter your email address here.
            We will send updates occasionally.
          </DialogContentText> */}
          <form className={styles.addTaskForm} onSubmit={handleAddTask}>
            {/* <Stack spacing={3}> */}
            <div>
              Title
              <TextField
                required
                className={styles.descTextField}
                inputProps={{ style: { fontSize: 14 } }}
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
                placeholder={module}
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
              Save
            </Button>
            {/* </FormControl> */}
            {/* </Stack> */}
            <div className={styles.blankSpace3}></div>
          </form>
        </DialogContent>
        {/* <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleClose} color="primary">
            Subscribe
          </Button>
        </DialogActions> */}
      </Dialog>
    </div>
  );
}
