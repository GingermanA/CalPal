//import { render } from "react-dom";
//import "./index.css";
import * as React from "react";
import {
  ScheduleComponent,
  ViewsDirective,
  ViewDirective,
  Day,
  Week,
  WorkWeek,
  Month,
  Agenda,
  Inject,
  Resize,
  DragAndDrop,
} from "@syncfusion/ej2-react-schedule";

//import { extend } from "@syncfusion/ej2-base";
import { DropDownListComponent } from "@syncfusion/ej2-react-dropdowns";
import { DateTimePickerComponent } from "@syncfusion/ej2-react-calendars";
import { SampleBase } from "./sample-base";
//import { PropertyPane } from "./property-pane";
//import * as dataSource from "./datasource.json";
//import { db } from "./config.js";
import fire from "../fire";
import { firebase } from "@firebase/app";

//import PageTodolist from "./PageTodolist";
import { Link } from "react-router-dom";

/**
 * Schedule Default sample
 */

export default class Scheduler extends SampleBase {
  constructor() {
    super(...arguments);
    const uid = firebase.auth().currentUser?.uid;
    fire
      .firestore()
      .collection("Users")
      .doc(uid)
      .collection("Events")
      .get()
      .then((querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => doc.data());
        this.test = data;
        this.data = fire
          .firestore()
          .collection("Users")
          .doc(uid)
          .collection("Events");
        let length = this.test.length;
        for (let i = 0; i < length; i++) {
          let endTime = this.test[i].EndTime.seconds.toString() + "000";
          let srtTime = this.test[i].StartTime.seconds.toString() + "000";
          this.test[i].StartTime = new Date(parseInt(srtTime));
          this.test[i].EndTime = new Date(parseInt(endTime));
        }
        try {
          this.scheduleObj.eventSettings.dataSource = this.test;
        } catch (err) {
          console.log(this.test);
        }
      });
  }
  GuidFun() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }
  onActionBegin(args) {
    if (args.requestType === "eventChange") {
      console.log(args);
      console.log(args.changedRecords);
      console.log(args.changedRecords[0]);
      console.log(args.changedRecords[0].Description);
      try {
        this.data
          .doc(args.changedRecords[0].DocumentId)
          .update({ Subject: args.changedRecords[0].Subject });
        this.data
          .doc(args.changedRecords[0].DocumentId)
          .update({ EndTime: args.changedRecords[0].EndTime });
        this.data
          .doc(args.changedRecords[0].DocumentId)
          .update({ StartTime: args.changedRecords[0].StartTime });
        this.data
          .doc(args.changedRecords[0].DocumentId)
          .update({ Location: args.changedRecords[0].Location });
        this.data
          .doc(args.changedRecords[0].DocumentId)
          .update({ Description: args.changedRecords[0].Description });
        this.data
          .doc(args.changedRecords[0].DocumentId)
          .update({ IsAllDay: args.changedRecords[0].IsAllDay });
        this.data
          .doc(args.changedRecords[0].DocumentId)
          .update({ RecurrenceRule: args.changedRecords[0].RecurrenceRule });
      } catch (err) {
        if (
          args.changedRecords[0].Description == null &&
          args.changedRecords[0].Location == null
        ) {
          this.data
            .doc(args.changedRecords[0].DocumentId)
            .update({ Description: "" });
          this.data
            .doc(args.changedRecords[0].DocumentId)
            .update({ Location: "" });
        } else if (args.changedRecords[0].Description == null) {
          this.data
            .doc(args.changedRecords[0].DocumentId)
            .update({ Description: "" });
        } else {
          this.data
            .doc(args.changedRecords[0].DocumentId)
            .update({ Location: "" });
        }
      }
    } else if (args.requestType === "eventCreate") {
      let guid = (
        this.GuidFun() +
        this.GuidFun() +
        "-" +
        this.GuidFun() +
        "-4" +
        this.GuidFun().substr(0, 3) +
        "-" +
        this.GuidFun() +
        "-" +
        this.GuidFun() +
        this.GuidFun() +
        this.GuidFun()
      ).toLowerCase();
      args.data[0].DocumentId = guid.toString();
      const argsData = args.data[0];
      if (argsData.Description == null && argsData.Location == null) {
        argsData.Description = "";
        argsData.Location = "";
      } else if (argsData.Location == null) {
        argsData.Location = "";
      } else if (argsData.Description == null) {
        argsData.Description = "";
      }
      this.data.doc(guid).set(args.data[0]);
    } else if (args.requestType === "eventRemove") {
      this.data.doc(args.deletedRecords[0].DocumentId).delete();
    }
  }

  editorWindowTemplate(props: any): JSX.Element {
    return (
      <table className="custom-event-editor">
        <tbody>
          <tr>
            <td className="e-textlabel">Title</td>
            <td>
              <input id="Title" name="Subject" type="text" />
            </td>
          </tr>
          <tr>
            <td className="e-textlabel">Module</td>
            <td>
              <DropDownListComponent
                id="Module"
                dataSource={["CS1010", "IEM", "MA1521"]}
                placeholder="Select module"
                data-name="Module"
                value={props.Module || null}
              ></DropDownListComponent>
            </td>
          </tr>
          <tr>
            <td className="e-textlabel">Type</td>
            <td>
              <DropDownListComponent
                id="Type"
                dataSource={["Lecture", "Tutorial", "Study Session"]}
                placeholder="Select type"
                data-name="Type"
                value={props.Type || null}
              ></DropDownListComponent>
            </td>
          </tr>
          <tr>
            <td className="e-textlabel">Location</td>
            <td>
              <input id="Location" name="Subject" type="text" />
            </td>
          </tr>
          <tr>
            <td className="e-textlabel">Start Time</td>
            <td>
              <DateTimePickerComponent
                id="StartTime"
                date-name="StartTime"
                value={new Date(props.startTime || props.StartTime)}
                format="dd/MM/yy hh:mm a"
              ></DateTimePickerComponent>
            </td>
          </tr>
          <tr>
            <td className="e-textlabel">End Time</td>
            <td>
              <DateTimePickerComponent
                id="EndTime"
                date-name="EndTime"
                value={new Date(props.endTime || props.EndTime)}
                format="dd/MM/yy hh:mm a"
              ></DateTimePickerComponent>
            </td>
          </tr>
        </tbody>
      </table>
    );
  }

  render() {
    return (
      <div className="schedule-control-section">
        <div className="col-lg-9 control-section">
          <div className="control-wrapper">
            <button onClick={() => fire.auth().signOut()}>Sign out</button>
            <Link to="/tasks">Tasks</Link>
            <ScheduleComponent
              height="650px"
              ref={(schedule) => (this.scheduleObj = schedule)}
              currentView="Month"
              actionBegin={this.onActionBegin.bind(this)}
              //eventSettings={{ dataSource: this.test }}
              //selectedDate={new Date(2019, 8, 27)}
              editorTemplate={this.editorWindowTemplate.bind(this)}
            >
              <ViewsDirective>
                <ViewDirective option="Day" />
                <ViewDirective option="Week" />
                <ViewDirective option="WorkWeek" />
                <ViewDirective option="Month" />
                <ViewDirective option="Agenda" />
              </ViewsDirective>

              <Inject
                services={[
                  Day,
                  Week,
                  WorkWeek,
                  Month,
                  Agenda,
                  Resize,
                  DragAndDrop,
                ]}
              />
            </ScheduleComponent>
          </div>
        </div>
      </div>
    );
  }
}
