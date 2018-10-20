import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';

const AnyReactComponent = ({ text }) => 
    <div>{text}</div>;

export default class SimpleMap extends Component {
  static defaultProps = {
    center: {
      lat: 37.774929,
      lng: -122.419416,
    },
    zoom: 11
  };

  render() {
    return (
      <div style={{ height: '100vh', width: '100%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: "AIzaSyBL4DlcsRwF30d3zcLPC4lm61kOPisqWaY" }}
          defaultCenter={this.props.center}
          defaultZoom={this.props.zoom}
        >
          <AnyReactComponent
            lat={37.774929}
            lng={-122.419416}
            text={'Kreyser Avrora'}
          />
        </GoogleMapReact>
      </div>
    );
  }
}

