import React, { useCallback } from "react";
import { withRouter } from "react-router";
import fire from "../fire";
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
              CalPal Sign Up
            </Typography>
          </center>
        </Box>
        <form className={useStyles.form} onSubmit={handleSignUp}>
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
                Sign up
              </Button>
            </Box>
            <Box mt={1}>
              <Grid container justify="flex-end">
                <Grid item>
                  <Link
                    onClick={() => {
                      history.push("/login");
                    }}
                    variant="body2"
                  >
                    Already have an account? Login here.
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </form>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
};

export default withRouter(SignUp);
