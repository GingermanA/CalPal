import React, { useCallback, useContext } from "react";
import { withRouter, Redirect } from "react-router";
import fire from "../fire";
import { AuthContext } from "../Auth";

const Login = ({ history }) => {
  const handleLogin = useCallback(
    async (event) => {
      event.preventDefault();
      const { email, password } = event.target.elements;
      try {
        await fire
          .auth()
          .signInWithEmailAndPassword(email.value, password.value);
        history.push("/scheduler");
        //history.push("/calendar");
      } catch (error) {
        alert(error);
      }
    },
    [history]
  );

  const { currentUser } = useContext(AuthContext);

  if (currentUser) {
    return <Redirect to="/scheduler" />;
  }

  return (
    <div>
      <h1>CalPal Log in</h1>
      <form onSubmit={handleLogin}>
        <label>
          Email
          <input name="email" type="email" placeholder="Email" />
        </label>
        <label>
          Password
          <input name="password" type="password" placeholder="Password" />
        </label>
        <button type="submit">Log in</button>
      </form>
      <p>
        Don't have an account?{" "}
        <span
          onClick={() => {
            history.push("/signup");
          }}
        >
          Sign Up
        </span>
      </p>
    </div>
  );
};

export default withRouter(Login);
