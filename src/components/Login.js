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
import firebase from "firebase/app";
import "firebase/auth";

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
      } catch (error) {
        alert(error);
      }
    },
    [history]
  );

  const { currentUser } = useContext(AuthContext);

  if (currentUser) {
    return <Redirect to="/tasks" />;
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

  // const handleGoogleSignIn = (firebase) => {
  //   const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
  //   firebase.auth().signInWithPopup(googleAuthProvider);
  // };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={useStyles.paper}>
        <Box mt={3}>
          <center>
            <Avatar className={useStyles.avatar}>
              <LockIcon />
            </Avatar>
          </center>
        </Box>
        <Box mt={2}>
          <center>
            <Typography component="h1" variant="h5">
              CalPal Login
            </Typography>
          </center>
        </Box>

        <form className={useStyles.form} onSubmit={handleLogin}>
          <Box mt={2}>
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
            <Box mt={1}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={useStyles.submit}
              >
                Login
              </Button>
            </Box>

            {/* <div justify-content="center">Or sign up using</div> */}
            <Box mt={1}>
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
            </Box>
            {/* <center> */}
            <Box mt={3}>
              <center>
                <Typography component="h1" variant="h5">
                  Or sign in with Google
                </Typography>
              </center>
            </Box>
            {/* </center> */}
            <center>
              <Box mt={1}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    const googleAuthProvider =
                      new firebase.auth.GoogleAuthProvider();
                    firebase.auth().signInWithPopup(googleAuthProvider);
                  }}
                >
                  Sign in with Google
                </Button>
              </Box>
            </center>
          </Box>
        </form>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
};

export default withRouter(Login);
