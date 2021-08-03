import { useState, useEffect } from "react";

//import Header from "../components/Header";
import { Link } from "react-router-dom";
import TaskEdit from "./TaskEdit";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import EventIcon from "@material-ui/icons/Event";
import AssignmentTurnedInIcon from "@material-ui/icons/AssignmentTurnedIn";
import MuiListItem from "@material-ui/core/ListItem";
import styles from "./PageEditTask.module.css";
import SideNavTasks from "./SideNavTasks";

import fire from "../fire";
import { setBlankIconStyle } from "@syncfusion/ej2-splitbuttons";

function PageEditTask(props) {
  console.log(props.selectedIndex);
  console.log(props.location.state);
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

  // const drawerWidth = 240;

  // const useStyles = makeStyles((theme) => ({
  //   root: {
  //     display: "flex",
  //   },
  //   appBar: {
  //     width: `calc(100% - ${drawerWidth}px)`,
  //     marginLeft: drawerWidth,
  //   },
  //   drawer: {
  //     width: drawerWidth,
  //     flexShrink: 0,
  //   },
  //   drawerPaper: {
  //     width: drawerWidth,
  //     background: "black",
  //   },
  //   active: {
  //     backgroundColor: "red",
  //   },
  //   // necessary for content to be below app bar
  //   toolbar: theme.mixins.toolbar,
  //   content: {
  //     flexGrow: 1,
  //     backgroundColor: theme.palette.background.default,
  //     padding: theme.spacing(3),
  //   },
  // }));

  // const ListItem = withStyles({
  //   root: {
  //     "&$selected": {
  //       backgroundColor: "red",
  //       color: "white",
  //     },
  //     "&$selected:hover": {
  //       backgroundColor: "purple",
  //       color: "white",
  //     },
  //     "&:hover": {
  //       backgroundColor: "blue",
  //       color: "white",
  //     },
  //   },
  //   selected: {},
  // })(MuiListItem);

  // const classes = useStyles();
  // const [selectedIndex, setSelectedIndex] = useState(1);

  return (
    <div className={styles.root}>
      <SideNavTasks />
      <main className={styles.content}>
        <TaskEdit
          tasks={tasks}
          setTasks={setTasks}
          editedTask={props.location.state}
        />
      </main>
    </div>
  );
}

export default PageEditTask;
