import React, { Component } from "react";
import {Grid,Row,Col,FormGroup,ControlLabel,FormControl} from "react-bootstrap";
import Card from "./Card.js";
import { FormInputs } from "./FormInputs.js";
import { UserCard } from "./UserCard.js";
import { Nothing } from './Nothing.js';
import Button from "./CustomButton.js";
import './User.css';


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
          An ancident ocurred near you!
        </h1>
        <p>
          There has been a {data.disasterData.disaster} in {data.disasterData.location}.
          The damaged area is of approximately {data.disasterData.accidentarea} squared kilometers
          and the current estimates predict {data.disasterData.deathcount} deaths, {data.disasterData.injurycount}
          injuries and {data.disasterData.homlesscount} people left without a home. Your help is needed!
        </p>
      </div>
    );
  }
}
