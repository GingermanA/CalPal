import React, { Component } from "react";
import fire from "../fire";
//import { debounce } from "lodash";

export default class ModuleManager extends Component {
  constructor() {
    super(...arguments);
    const uid = fire.auth().currentUser?.uid;
    this.ref = fire
      .firestore()
      .collection("Users")
      .doc(uid)
      .collection("Modules")
      .doc("My Modules");

    this.state = {
      modCode: [],
      newMod: "",
    };
    //this.addModule = this.addModule.bind(this);
    //this.setModules = this.setModules.bind(this);

    this.ref
      .get()
      .then((doc) => {
        if (doc.exists) {
<<<<<<< HEAD
          console.log("if case is happening");
          //console.log(doc.data().modCode);
          this.setState({ modCode: doc.data().modCode }, () => {
            this.addModule();
            console.log(this.state.modCode);
          });

          //this.state.modCode = mods;
        } else {
          console.log("else case is happening");
          // const mods = [];
          // this.state.modCode = mods;
=======
          const mods = doc.data().modCode;
          this.state.modCode = mods;
        } else {
          const mods = [];
          this.state.modCode = mods;
>>>>>>> 6c9ce6da54adcc404aec1903bbed8f60192c65f3
        }
      })
      .catch((error) => {
        console.log("error is caught");
      });
<<<<<<< HEAD
    //console.log(this.state);
    //console.log(this.state.modCode);
=======
>>>>>>> 6c9ce6da54adcc404aec1903bbed8f60192c65f3
  }

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
    this.ref.set({ modCode: this.state.modCode });
  };

  // setModules = () => {
  //   if (this.state.newMod !== "") {
  //     this.state.modCode.push(this.state.newMod);
  //     this.ref.set({ modCode: this.state.modCode });
  //     console.log(this.state.modCode);
  //   }
  // };

  render() {
    console.log(this.state.modCode);
    return (
      <div className="form-group sign-in">
        <div className="input-group">
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
      </div>
    );
  }
}
