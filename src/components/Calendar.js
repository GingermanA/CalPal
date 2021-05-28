import React, { useState } from "react";
import fire from "../fire";
import Calendar from "react-calendar";

const Cal = () => {
  const [value, onChange] = useState(new Date());
  return (
    <>
      <h1>Home</h1>
      <button onClick={() => fire.auth().signOut()}>Sign out</button>
      <div>
        <Calendar onChange={onChange} value={value} />
      </div>
    </>
  );
};

export default Cal;
