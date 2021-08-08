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
  RecurrenceEditorComponent,
} from "@syncfusion/ej2-react-schedule";
import { DropDownListComponent } from "@syncfusion/ej2-react-dropdowns";
import { DateTimePickerComponent } from "@syncfusion/ej2-react-calendars";
import { SampleBase } from "./sample-base";
import fire from "../fire";
import SideNavScheduler from "./SideNavScheduler";

//To help with the dragging and dropping of modules into the scheduler, and the appropriate css for the scheduler
import {
  TreeViewComponent,
  DragAndDropEventArgs,
} from "@syncfusion/ej2-react-navigations";
import "./Scheduler.css";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";

export default class AddToScheduler extends SampleBase {
  color: Array[] = [
    "#e97474",
    "#7b8eeb",
    "#b074e9",
    "#5ac75c",
    "#dedf00",
    "#ffae55",
    "#7e4591",
    "#ff91f4",
    "#935b5b",
    "#a7a7a7",
  ];

  treeViewMod: { [key: string]: Object }[] = [];
  fieldMod: Object = {};

  treeViewTask: { [key: string]: Object }[] = [];
  fieldTask: Object = {};

  constructor(props) {
    super(props);
    // console.log(this.props.location.state);

    this.state = {
      modCode: [],
      modColor: [],
      colors: [],
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
          console.log(this.test);
        } catch (err) {
          // console.log(this.test);
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
          this.treeViewMod = doc.data().modCode.map((name, index) => {
            return {
              Name: name,
              Color: doc.data().modColor[index],
              Id: index,
            };
          });
          // console.log(this.treeViewMod);
          this.fieldMod = {
            dataSource: this.treeViewMod,
            id: "Id",
            text: "Name",
          };

          // console.log(doc.data().colors.length);
          this.setState(
            {
              modCode: doc.data().modCode,
              modColor: doc.data().modColor,
              colors: doc.data().colors,
            },
            () => {
              this.addModule();
            }
          );
        } else {
          this.setState(
            {
              colors: this.color,
            },
            () => {
              this.initiationUpdateFire();
            }
          );
        }
      })
      .catch((error) => {
        console.log(error);
      });

    this.treeViewTask.push(this.props.location.state);

    this.fieldTask = {
      dataSource: this.treeViewTask,
      id: "Module",
      text: "Title",
    };
  }

  randomColor = () => "#" + Math.floor(Math.random() * 16777215).toString(16);

  //Enter Module in the form and Module list / Firebase will be updated
  addModule = (text) => {
    this.setState({ newMod: text });
  };

  setModules = () => {
    console.log(this.state);
    if (this.state.newMod !== undefined) {
      const newModCode = this.state.modCode.slice();
      const newModColor = this.state.modColor.slice();
      const newColors = this.state.colors.slice();
      newModCode.push(this.state.newMod);
      if (newColors.length > 0) {
        newModColor.push(newColors.shift());
      } else {
        newModColor.push(this.randomColor());
      }
      this.setState(
        { modCode: newModCode, modColor: newModColor, colors: newColors },
        () => {
          this.loadEdits();
          this.updateFire();
        }
      );
    } else {
    }
  };

  initiationUpdateFire = () => {
    //this.setModules();
    this.modsRef.set({
      colors: this.state.colors,
    });
    this.forceUpdate();
  };

  updateFire = () => {
    //this.setModules();
    try {
      this.modsRef.set({
        modCode: this.state.modCode,
        modColor: this.state.modColor,
        colors: this.state.colors,
      });
      this.forceUpdate();
    } catch (err) {}
  };

  //CRUD operations on Scheduler

  GuidFun() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }

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
        // console.log(args.changedRecords[0]);
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
      } catch (err) {}
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
      this.loadEdits();
      this.props.history.push("/scheduler");
    } else if (args.requestType === "eventRemove") {
      if (args.changedRecords === []) {
        this.data.doc(args.changedRecords[0].DocumentId).delete();
      } else {
        this.data.doc(args.deletedRecords[0].DocumentId).delete();
      }
    }
    this.loadEdits();
  }

  //Color coding of Events based on Modules

  onEventRendered(args) {
    // console.log(this.state.modCode);
    // console.log(this.treeViewMod);
    for (let i = 0; i < this.treeViewMod.length; i++) {
      if (args.data.Module === this.treeViewMod[i].Name) {
        args.element.style.backgroundColor = this.treeViewMod[i].Color;
      }
    }
  }

  //Other functionalities

  onTreeDragStopTask(args: DragAndDropEventArgs): void {
    try {
      console.log(args.draggedNodeData);
      let cellData: CellClickEventArgs = this.scheduleObj.getCellDetails(
        args.target
      );
      let eventData: { [key: string]: Object } = {
        Subject: args.draggedNodeData.text,
        Module: args.draggedNodeData.id,
        //Type: args.draggedNodeData.Type,
        StartTime: cellData.startTime,
        EndTime: cellData.endTime,
        IsAllDay: cellData.isAllDay,
      };
      console.log(eventData);
      this.scheduleObj.openEditor(eventData, "Add", true);
    } catch (err) {
      //console.log(err);
    }
  }

  nodeTemplate = (data) => {
    const color = data.Color;

    return (
      <div className="min-width">
        {/* <div className="blankSpace3" backgroundColor={data.Color}></div> */}
        <div className="mod-color">
          <FiberManualRecordIcon style={{ color: color }} />
        </div>
        <div className="inline">
          <span className="treeName">{data.Name}</span>
        </div>
      </div>
    );
  };

  componentDidUpdate(prevState) {
    if (prevState.modCode !== this.state.modCode) {
      // console.log(this.state.modCode);
      this.treeViewMod = this.state.modCode
        .map((name, index) => {
          return {
            Name: name,
            Color: this.state.modColor[index],
            Id: index,
          };
        })
        .filter((mod) => mod.Name !== "");
      this.fieldMod = {
        dataSource: this.treeViewMod,
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
                dataSource={this.treeViewMod}
                fields={this.fieldMod}
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
          {/* <tr>
            <td className="e-textlabel">Recurrence</td>
            <td>
              <RecurrenceEditorComponent
                id="RecurrenceEditor"
                ref={(recurrObject) => (this.recurrObject = recurrObject)}
              ></RecurrenceEditorComponent>
            </td>
          </tr> */}
        </tbody>
      </table>
    );
  }

  render() {
    //Redirects user if they enter "/tasks/add" as url
    if (this.props.location.state === undefined) {
      this.props.history.push("/scheduler");
      return null;
    }
    this.loadEdits();
    return (
      <div className="schedule-control-section">
        <div className="col-lg-9 control-section">
          <div className="control-wrapper">
            <SideNavScheduler />
            <div className="scheduler">
              <ScheduleComponent
                height="650px"
                ref={(schedule) => (this.scheduleObj = schedule)}
                currentView="Week"
                actionBegin={this.onActionBegin.bind(this)}
                editorTemplate={this.editorWindowTemplate.bind(this)}
                eventRendered={this.onEventRendered.bind(this)}
              >
                <ViewsDirective>
                  <ViewDirective option="Day" />
                  <ViewDirective option="Week" />
                  <ViewDirective option="WorkWeek" />
                  <ViewDirective option="Month" />
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
            <div className="module-manager">
              <div className="heading-wrapper">
                <h2 className="module-manager-heading">Tasks to Add</h2>
              </div>
              <div className="padding">
                <TreeViewComponent
                  fields={this.fieldTask}
                  allowDragAndDrop={true}
                  nodeDragStop={this.onTreeDragStopTask.bind(this)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
