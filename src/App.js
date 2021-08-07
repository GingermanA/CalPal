import React from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import Scheduler from "./components/Scheduler";
import PageTodolist from "./components/PageTodolist";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import { AuthProvider } from "./Auth";
import PrivateRoute from "./PrivateRoute";
import AddToScheduler from "./components/AddToScheduler";
import PageEditTask from "./components/PageEditTask";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Switch>
          <PrivateRoute path="/scheduler" component={Scheduler} />
          <PrivateRoute exact path="/tasks" component={PageTodolist} />
          <PrivateRoute exact path="/tasks/add" component={AddToScheduler} />
          <PrivateRoute exaact path="/tasks/edit" component={PageEditTask} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/signup" component={SignUp} />
          <Redirect from="/" to="/login" />
        </Switch>
      </Router>
    </AuthProvider>
  );
};

export default App;
