import React from "react";
import { BrowserRouter as Router, Redirect, Route } from "react-router-dom";
import Scheduler from "./components/Scheduler";
import PageTodolist from "./components/PageTodolist";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import { AuthProvider } from "./Auth";
import PrivateRoute from "./PrivateRoute";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Redirect from="/" to="/login" />
        <div>
          <PrivateRoute exact path="/scheduler" component={Scheduler} />
          <PrivateRoute exact path="/tasks" component={PageTodolist} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/signup" component={SignUp} />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
