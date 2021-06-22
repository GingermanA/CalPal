import { render } from "@testing-library/react";
import React, { Component } from "react";

export default class NodeTemplate extends Component {
  delete = () => {
    this.props.deleteModule(this.props.index);
  };

  render() {
    return (
      <div>
        <div className="treeviewdiv">
          <div className="textcontent">
            <span className="treeName">{this.props.name}</span>
          </div>
          <div className="countcontainer">
            <button className="e-icons e-delete" onClick={this.delete}>
              delete
            </button>
          </div>
        </div>
      </div>
    );
  }
}
