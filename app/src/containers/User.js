import React, { Component } from "react";
import { Nothing } from './Nothing.js';
import SimpleMap from "./SimpleMap"
import './User.css';

const AnyReactComponent = ({ text }) => <div>{text}</div>;

export default class User extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: {}
    };
  }

  componentDidMount() {
    fetch('https://r0zcs2y6eb.execute-api.eu-west-1.amazonaws.com/default/getUserData')
      .then(response => response.json())
      .then(data => this.setState({ data }));
  }

  render(props) {
    const data = this.state.data && this.state.data.length ? this.state.data.find(user => user.email === this.props.email) : null;
    console.log(`Data: ${JSON.stringify(data)}`);
    if (!data) {
      return <Nothing />;
    }

    return (
      <div className="content">
        <h1 className="title">
          An accident occurred near you!
        </h1>
        <div>
          <p>Type: {data.disasterData.disaster.replace(/"/g, '')}</p>
          <p>Location: {data.disasterData.location.replace(/"/g, '')}</p>
          <p>People Needed: {data.disasterData.peopleneeded}</p>
          <p>Damaged Area: {data.disasterData.accidentarea} km2</p>
          <p>Estimated {data.disasterData.deathcount} deaths </p>
          <p>Injuries: {data.disasterData.injurycount} </p>
          <p>Homeless people: {data.disasterData.homelesscount} </p>
          <p>Your help is needed!</p>
        </div>
        <SimpleMap needed={data.disasterData.peopleneeded} location={data.disasterData.location} />
      </div>
    );
  }
}
