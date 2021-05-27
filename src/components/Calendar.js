import React from "react";
import fire from "../fire";

const Calendar = () => {
  return (
    <>
      <h1>Home</h1>
      <button onClick={() => fire.auth().signOut()}>Sign out</button>
    </>
  );
};

export default Calendar;
