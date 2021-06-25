import React, { useCallback } from "react";
import { withRouter } from "react-router";
import fire from "../fire";

const SignUp = ({ history }) => {
  const handleSignUp = useCallback(
    async (event) => {
      event.preventDefault();
      const { email, password } = event.target.elements;
      try {
        await fire
          .auth()
          .createUserWithEmailAndPassword(email.value, password.value);
        history.push("/scheduler");
      } catch (error) {
        alert(error);
      }
    },
    [history]
  );

  return (
    <div>
      <h1>Sign up</h1>
      <form onSubmit={handleSignUp}>
        <label>
          Email
          <input name="email" type="email" placeholder="Email" />
        </label>
        <label>
          Password
          <input name="password" type="password" placeholder="Password" />
        </label>
        <button type="submit">Sign Up</button>
      </form>
      <p>
        Have an account?{" "}
        <span
          onClick={() => {
            history.push("/login");
          }}
        >
          Login
        </span>
      </p>
    </div>
  );
};

export default withRouter(SignUp);
