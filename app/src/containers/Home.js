import React, { Component } from "react";
import "./Home.css";
import SimpleMap from "./SimpleMap"

export default class Home extends Component {
  render() {
    return (
      <div className="Home">
        <div className="lander">

        <div class="jumbotron-fluid">
        <h1>BeResponsive</h1>
        </div>
        <SimpleMap></SimpleMap>
        </div>
      </div>
    );
  }
}