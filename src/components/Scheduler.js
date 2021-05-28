import React, { useState } from "react";
import fire from "../fire";
import {
  Inject,
  ScheduleComponent,
  Day,
  Week,
  WorkWeek,
  Month,
  Agenda,
} from "@syncfusion/ej2-react-schedule";

const Scheduler = () => {
  return (
    <>
      <button onClick={() => fire.auth().signOut()}>Sign out</button>
      <ScheduleComponent>
        <Inject services={[Day, Week, WorkWeek, Month, Agenda]}></Inject>
      </ScheduleComponent>
    </>
  );
};

export default Scheduler;
