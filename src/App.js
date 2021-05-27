//import { clear } from "node:console";
import React, { useState, useEffect } from "react";
import Login from "./components/Login";
import Calendar from "./components/Calendar";
import fire from "./fire";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

//import logo from "./logo.svg";
//import "./App.css";

const App = () => {
  const [user, setUser] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [hasAccount, setHasAccount] = useState(false);

  const clearInputs = () => {
    setEmail("");
    setPassword("");
  };

  const clearErrors = () => {
    setEmailError("");
    setPasswordError("");
  };

  const handleLogin = () => {
    clearErrors();
    fire
      .auth()
      .signInWithEmailAndPassword(email, password)
      .catch((err) => {
        switch (err.code) {
          case "auth/invalid-email":
          case "auth/user-disable":
          case "auth/user-not-found":
            setEmailError(err.message);
            break;
          case "auth/wrong-password":
            setPasswordError(err.message);
            break;
        }
      });
  };

  const handleSignUp = () => {
    clearErrors();
    fire
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .catch((err) => {
        switch (err.code) {
          case "auth/email-already-in-use":
          case "auth/invalid-email":
            setEmailError(err.message);
            break;
          case "auth/weak-password":
            setPasswordError(err.message);
            break;
        }
      });
  };

  const handleLogout = () => {
    fire.auth().signOut();
  };

  const authListener = () => {
    fire.auth().onAuthStateChanged((user) => {
      if (user) {
        clearInputs();
        setUser(user);
      } else {
        setUser("");
      }
    });
  };

  useEffect(() => {
    authListener();
  }, []);

  return (
    <div>
      <Router>
        <Switch>
          <Route exact path="/">
            <Login
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              handleLogin={handleLogin}
              handleSignUp={handleSignUp}
              hasAccount={hasAccount}
              setHasAccount={setHasAccount}
              emailError={emailError}
              passwordError={passwordError}
            />
          </Route>
          <Route exact path="/calendar">
            <Calendar handleLogout={handleLogout} />
          </Route>
        </Switch>
      </Router>
    </div>
  );
};

export default App;
