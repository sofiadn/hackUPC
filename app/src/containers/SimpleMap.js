import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import { findDOMNode } from 'react-dom';
import Tooltip from 'rc-tooltip';
import './SimpleMap.css';
import 'rc-tooltip/assets/bootstrap_white.css';

const MapPointer = ({ needed }) => (
  <div>
    <Tooltip
      placement="top"
      trigger={['click']}
      overlay={
        <span>There is {Math.round(needed * 0.25)} people needed.</span>
      }
    >
      <div className='pointer' />
    </Tooltip>
    <Tooltip
      placement="top"
      trigger={['click']}
      overlay={
        <span>There is {Math.round(needed * 0.75)} people needed.</span>
      }
    >
      <div className='pointer-2' />
    </Tooltip>
  </div>
);


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
      <div className='map'>
        <GoogleMapReact
          bootstrapURLKeys={{ key: "AIzaSyBL4DlcsRwF30d3zcLPC4lm61kOPisqWaY" }}
          defaultCenter={this.props.center}
          defaultZoom={this.props.zoom}
        >
          <MapPointer
            lat={37.774929}
            lng={-122.419416}
            text={''}
            needed={this.props.needed}
          />
        </GoogleMapReact>
      </div>
    );
  }
}
