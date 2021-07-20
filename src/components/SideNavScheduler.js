import { useState, useEffect } from "react";

//import Header from "../components/Header";
import { Link } from "react-router-dom";
import TaskManager from "./TaskManager";
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
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import IconButton from "@material-ui/core/IconButton";
import fire from "../fire";

export default function SideNavScheduler() {
  const drawerWidth = 240;

  const useStyles = makeStyles((theme) => ({
    root: {
      display: "flex",
    },
    appBar: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
      background: "black",
    },
    active: {
      backgroundColor: "red",
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    blank: {
      height: "520px",
    },
    signout: {
      display: "inline-block",
      textAlign: "right",
    },
    //   content: {
    //     flexGrow: 1,
    //     backgroundColor: theme.palette.background.default,
    //     padding: theme.spacing(3),
    //   },
  }));

  const ListItem = withStyles({
    root: {
      "&$selected": {
        backgroundColor: "red",
        color: "white",
      },
      "&$selected:hover": {
        backgroundColor: "purple",
        color: "white",
      },
      "&:hover": {
        backgroundColor: "blue",
        color: "white",
      },
    },
    selected: {},
  })(MuiListItem);

  const classes = useStyles();
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };

  return (
    <>
      <CssBaseline />
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
        anchor="left"
      >
        <div className={classes.toolbar}>
          <h1 style={{ color: "#ffffff" }}>CalPal</h1>
          {/* <ListItem>
            <ListItemText primary="CalPal" style={{ color: "#ffffff" }} />
          </ListItem> */}
        </div>
        <Divider />
        <List>
          <ListItem
            button
            component={Link}
            to="/scheduler"
            selected={selectedIndex === 0}
            onClick={(event) => handleListItemClick(event, 0)}
          >
            <ListItemIcon>
              <EventIcon style={{ color: "#ffffff" }} />
            </ListItemIcon>
            <ListItemText primary="Scheduler" style={{ color: "#ffffff" }} />
          </ListItem>
          <ListItem
            button
            component={Link}
            to="/tasks"
            selected={selectedIndex === 1}
            onClick={(event) => handleListItemClick(event, 1)}
          >
            <ListItemIcon>
              <AssignmentTurnedInIcon style={{ color: "#ffffff" }} />
            </ListItemIcon>
            <ListItemText primary="Tasks" style={{ color: "#ffffff" }} />
          </ListItem>
        </List>
        <div className={classes.blank} />
        <div className={classes.signout}>
          <IconButton onClick={() => fire.auth().signOut()}>
            <ExitToAppIcon style={{ color: "#ffffff", fontSize: 40 }} />
          </IconButton>
        </div>
      </Drawer>
    </>
  );
}
