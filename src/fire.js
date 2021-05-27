import firebase from "firebase";

var firebaseConfig = {
  apiKey: "AIzaSyDpNpK9tTA82cG-LbmhLkrY96GM7nO7JdI",
  authDomain: "calpal-49df5.firebaseapp.com",
  projectId: "calpal-49df5",
  storageBucket: "calpal-49df5.appspot.com",
  messagingSenderId: "57257575356",
  appId: "1:57257575356:web:918c8359dbd7c14bf521b9",
  measurementId: "G-332LB4Y412",
};

const fire = firebase.initializeApp(firebaseConfig);
// firebase.analytics();

export default fire;
