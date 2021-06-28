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
  CellClickEventArgs,
} from "@syncfusion/ej2-react-schedule";

//import { extend } from "@syncfusion/ej2-base";
import { DropDownListComponent } from "@syncfusion/ej2-react-dropdowns";
import { DateTimePickerComponent } from "@syncfusion/ej2-react-calendars";
import { SampleBase } from "./sample-base";
import fire from "../fire";

import { Link } from "react-router-dom";

//To help with the dragging and dropping of modules into the scheduler, and the appropriate css for the scheduler
import {
  TreeViewComponent,
  DragAndDropEventArgs,
} from "@syncfusion/ej2-react-navigations";
import "./Scheduler.css";

//import ModuleManager from "./ModuleManager";
//import ModuleList from "./ModuleList";

export default class Scheduler extends SampleBase {
  color: Array[] = [
    "red",
    "blue",
    "black",
    "green",
    "yellow",
    "orange",
    "purple",
    "pink",
    "grey",
    "brown",
    "cyan",
  ];

  treeViewData: { [key: string]: Object }[] = [];
  field: Object = {};

  constructor() {
    super(...arguments);
    this.state = {
      modCode: [],
      newMod: "",
      text: "",
    };
    const uid = fire.auth().currentUser?.uid;
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

    this.modsRef = fire
      .firestore()
      .collection("Users")
      .doc(uid)
      .collection("Modules")
      .doc("My Modules");

    this.modsRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          this.treeViewData = doc.data().modCode.map((name, index) => {
            return {
              Name: name,
              Color: this.color[index],
              Id: index,
            };
          });
          this.field = {
            dataSource: this.treeViewData,
            id: "Id",
            text: "Name",
          };

          this.setState({ modCode: doc.data().modCode }, () => {
            this.addModule();
          });
        } else {
        }
      })
      .catch((error) => {
        console.log("error is caught");
      });
  }

  //Enter Module in the form and Module list / Firebase will be updated
  addModule = (text) => {
    this.setState({ newMod: text });
  };

  setModules = () => {
    if (this.state.newMod !== "") {
      this.setState(
        { modCode: [...this.state.modCode, this.state.newMod] },
        () => {
          this.updateFire();
        }
      );
    }
  };

  updateFire = () => {
    //this.setModules();
    this.modsRef.set({ modCode: this.state.modCode });
    this.forceUpdate();
  };

  //CRUD operations on Scheduler

  GuidFun() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }
  // this.data
  //   .doc(args.changedRecords[0].DocumentId)
  //   .update({ IsAllDay: args.changedRecords[0].IsAllDay });
  // this.data
  //   .doc(args.changedRecords[0].DocumentId)
  //   .update({ RecurrenceRule: args.changedRecords[0].RecurrenceRule });

  loadEdits() {
    const uid = fire.auth().currentUser?.uid;
    fire
      .firestore()
      .collection("Users")
      .doc(uid)
      .collection("Events")
      .onSnapshot((querySnapshot) => {
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
          // console.log(this.test);
        }
      });
  }

  onActionBegin(args) {
    if (args.requestType === "eventChange") {
      try {
        console.log(args.changedRecords[0]);
        this.data
          .doc(args.changedRecords[0].DocumentId)
          .update({ Subject: args.changedRecords[0].Subject });
        this.data
          .doc(args.changedRecords[0].DocumentId)
          .update({ Module: args.changedRecords[0].Module });
        this.data
          .doc(args.changedRecords[0].DocumentId)
          .update({ Type: args.changedRecords[0].Type });
        if (args.changedRecords[0].Location != null) {
          this.data
            .doc(args.changedRecords[0].DocumentId)
            .update({ Location: args.changedRecords[0].Location });
        }
        this.data
          .doc(args.changedRecords[0].DocumentId)
          .update({ EndTime: args.changedRecords[0].EndTime });
        this.data
          .doc(args.changedRecords[0].DocumentId)
          .update({ StartTime: args.changedRecords[0].StartTime });
        console.log(args.changedRecords[0]);
        this.loadEdits();
      } catch (err) {
        // if (args.changedRecords[0].Location == null) {
        //   this.data
        //     .doc(args.changedRecords[0].DocumentId)
        //     .update({ Location: "" })
        //     .then(() => this.loadEdits());
        // } else {
        //   this.data
        //     .doc(args.changedRecords[0].DocumentId)
        //     .update({ Location: "" })
        //     .then(() => this.loadEdits());
        // }
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
      if (argsData.Location == null) {
        argsData.Location = "";
      }
      if (argsData.Module == null) {
        argsData.Module = "";
      }
      if (argsData.Type == null) {
        argsData.Type = "";
      }
      this.data.doc(guid).set({
        Subject: argsData.Subject,
        DocumentId: argsData.DocumentId,
        EndTime: argsData.EndTime,
        Location: argsData.Location,
        Module: argsData.Module,
        StartTime: argsData.StartTime,
        Type: argsData.Type,
      });
    } else if (args.requestType === "eventRemove") {
      this.data
        .doc(args.deletedRecords[0].DocumentId)
        .delete()
        .then(() => this.loadEdits());
    }
  }

  //Color coding of Events based on Modules

  onEventRendered(args) {
    for (let i = 0; i < this.treeViewData.length; i++) {
      if (args.data.Module === this.treeViewData[i].Name) {
        args.element.style.backgroundColor = this.treeViewData[i].Color;
      }
    }
  }

  //Other functionalities

  onTreeDragStop(args: DragAndDropEventArgs): void {
    let cellData: CellClickEventArgs = this.scheduleObj.getCellDetails(
      args.target
    );
    let eventData: { [key: string]: Object } = {
      Module: args.draggedNodeData.text,
      StartTime: cellData.startTime,
      EndTime: cellData.endTime,
      IsAllDay: cellData.isAllDay,
    };
    this.scheduleObj.openEditor(eventData, "Add", true);
  }

  editModules(args) {
    const newModCode = this.state.modCode.slice();
    for (let i = 0; i < newModCode.length; i++) {
      if (newModCode[i] === args.oldText) {
        newModCode[i] = args.newText;
      }
    }
    this.setState({ modCode: newModCode }, () => {
      this.updateFire();
    });
    this.loadEdits();
  }

  deleteModules = (index) => {
    console.log(index);
    const newModCode = this.state.modCode.slice();
    const removed = newModCode.splice(index, 1);
    this.setState({ modCode: newModCode }, () => {
      this.updateFire();
    });
    this.loadEdits();
  };

  nodeTemplate = (data) => {
    console.log(data);
    return (
      <div>
        <div className="treeviewdiv">
          <div className="textcontent">
            <span className="treeName">{data.Name}</span>
          </div>
          <div className="countcontainer">
            <button onClick={this.deleteModules.bind(this, data.Id)}>
              Remove
            </button>
          </div>
        </div>
      </div>
    );
  };

  componentDidUpdate(prevState) {
    if (prevState.modCode !== this.state.modCode) {
      console.log(this.state.modCode);
      this.treeViewData = this.state.modCode.map((name, index) => {
        return {
          Name: name,
          Color: this.color[index],
          Id: index,
        };
      });
      this.field = {
        dataSource: this.treeViewData,
        id: "Id",
        text: "Name",
      };
    }
  }

  editorWindowTemplate(props: any): JSX.Element {
    return (
      <table className="custom-event-editor">
        <tbody>
          <tr>
            <td className="e-textlabel">Title</td>
            <td>
              <input
                id="Subject"
                className="e-field e-input"
                name="Subject"
                type="text"
              />
            </td>
          </tr>
          <tr>
            <td className="e-textlabel">Module</td>
            <td>
              <DropDownListComponent
                id="Module"
                className="e-field"
                //dataSource={["CS1010", "IEM", "MA1521"]}
                dataSource={this.state.modCode}
                fields={this.field}
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
                className="e-field"
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
              <input
                id="Location"
                className="e-field e-input"
                name="Location"
                type="text"
              />
            </td>
          </tr>
          <tr>
            <td className="e-textlabel">Start Time</td>
            <td>
              <DateTimePickerComponent
                id="StartTime"
                className="e-field"
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
                className="e-field"
              ></DateTimePickerComponent>
            </td>
          </tr>
        </tbody>
      </table>
    );
  }

  render() {
    //console.log(this.state.modCode);
    console.log(this.treeViewData[0]);
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
              eventRendered={this.onEventRendered.bind(this)}
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
        <div className="treeview-title-container">Modules</div>
        {/* <div className="treeview-form">
          <ModuleManager />
        </div> */}
        <div className="treeview-form">
          <textarea
            // value="Enter your module here!"
            className="form-control"
            //onChange={(event) => this.setState({ newMod: event.target.value })}
            onChange={(e) => this.addModule(e.target.value)}
          />
          <button
            type="submit"
            className="btn btn-md btn-primary sign-in-button"
            onClick={this.setModules}
          >
            Post
          </button>
        </div>
        <div className="treeview-component">
          <TreeViewComponent
            fields={this.field}
            allowDragAndDrop={true}
            allowEditing={true}
            nodeDragStop={this.onTreeDragStop.bind(this)}
            nodeEdited={this.editModules.bind(this)}
            nodeTemplate={this.nodeTemplate}
            //nodeSelected={this.onNodeSelected.bind(this)}
            //dataBound={this.dataBound}
          />
        </div>
      </div>
    );
  }
}
