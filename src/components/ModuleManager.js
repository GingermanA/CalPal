import React, { Component } from "react";
import fire from "../fire";

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

    this.ref
      .get()
      .then((doc) => {
        if (doc.exists) {
          const mods = doc.data().modCode;
          this.state.modCode = mods;
        } else {
          const mods = [];
          this.state.modCode = mods;
        }
      })
      .catch((error) => {
        console.log("error is caught");
      });
  }

  setModules() {
    this.state.modCode.push(this.state.newMod);
    this.ref.set({ modCode: this.state.modCode });
  }

  render() {
    return (
      <div className="form-group sign-in">
        <div className="input-group">
          <textarea
            // value="Enter your module here!"
            className="form-control"
            onChange={(event) => this.setState({ newMod: event.target.value })}
          />
          <button
            type="submit"
            className="btn btn-md btn-primary sign-in-button"
            onClick={() => this.setModules()}
          >
            Post
          </button>
        </div>
      </div>
    );
  }
}
