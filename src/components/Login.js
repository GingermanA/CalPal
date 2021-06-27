import React, { useCallback, useContext } from "react";
import { withRouter, Redirect } from "react-router";
import fire from "../fire";
import { AuthContext } from "../Auth";
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Link,
  Grid,
  Box,
  Typography,
  makeStyles,
  Container,
} from "@material-ui/core";
import LockIcon from "@material-ui/icons/Lock";

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
    //return <Redirect to="/calendar" />;
  }

  function Copyright() {
    return (
      <Typography variant="body2" color="textSecondary" align="center">
        {"Copyright © "}
        <Link color="inherit" href="https://material-ui.com/">
          CalPal
        </Link>{" "}
        {new Date().getFullYear()}
        {"."}
      </Typography>
    );
  }

  const useStyles = makeStyles((theme) => ({
    paper: {
      marginTop: theme.spacing(8),
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main,
    },
    form: {
      width: "100%", // Fix IE 11 issue.
      marginTop: theme.spacing(3),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
  }));

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={useStyles.paper}>
        <Avatar className={useStyles.avatar}>
          <LockIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          CalPal Login
        </Typography>
        <form className={useStyles.form} onSubmit={handleLogin}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={useStyles.submit}
          >
            Login
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link
                onClick={() => {
                  history.push("/signup");
                }}
                variant="body2"
              >
                Don't have an account? Sign up now!
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
  // <div>
  //   <h1>CalPal Log in</h1>
  //   <form onSubmit={handleLogin}>
  //     <label>
  //       Email
  //       <input name="email" type="email" placeholder="Email" />
  //     </label>
  //     <label>
  //       Password
  //       <input name="password" type="password" placeholder="Password" />
  //     </label>
  //     <button type="submit">Log in</button>
  //   </form>
  //   <p>
  //     Don't have an account?{" "}
  //     <span
  //       onClick={() => {
  //         history.push("/signup");
  //       }}
  //     >
  //       Sign Up
  //     </span>
  //   </p>
  // </div>
  // );
};

export default withRouter(Login);
