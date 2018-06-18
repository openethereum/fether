// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import { STATUS } from '../stores/healthStore';

import loading from '../assets/img/icons/loading.svg';

@inject('healthStore')
@observer
class Overlays extends Component {
  state = {
    isVisible: false // Only make Overlay visible if the overlay error persists for 2s or more
  };

  componentDidUpdate () {
    this.timeout = setTimeout(() => {
      this.setState({ isVisible: true });
    }, 3000);
  }

  componentWillUnmount () {
    clearTimeout(this.timeout);
  }

  render () {
    const {
      healthStore: {
        health: { status }
      }
    } = this.props;

    // isVisible is:
    // - true if the status is anything but ClockNotSync or Syncing
    // - or else this.state.isVisible
    const isVisible =
      ![STATUS.CLOCKNOTSYNC, STATUS.SYNCING].includes(status) ||
      this.state.isVisible;

    if (!isVisible) {
      return null;
    }

    return (
      <div className='window_overlay'>
        <div className='alert-screen'>
          <div className='alert-screen_content'>
            <div className='alert-screen_image'>
              <img alt='loading' src={loading} />
            </div>
            <div className='alert-screen_text'>
              <h1>{this.renderTitle()}</h1>
              <p>{this.renderDescription()}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderDescription = () => {
    const {
      healthStore: {
        health: { status, payload }
      }
    } = this.props;

    switch (status) {
      case STATUS.CLOCKNOTSYNC:
        return `Mac: System Preferences -> Date &amp; Time -> Uncheck and recheck
        "Set date and time automatically"
        Windows: Control Panel -> "Clock, Language, and Region" -> "Date
        and Time" -> Uncheck and recheck "Set date and time automatically"`;
      case STATUS.SYNCING:
      case STATUS.DOWNLOADING:
        return payload && payload.percentage ? `${payload.percentage}%` : '';
      case STATUS.NOINTERNET:
        return 'Please check that you are connected to the internet';
      default:
        return '';
    }
  };

  renderTitle = () => {
    const {
      healthStore: {
        health: { status }
      }
    } = this.props;

    switch (status) {
      case STATUS.CLOCKNOTSYNC:
        return 'Your clock is not sync';
      case STATUS.DOWNLOADING:
        return 'Downloading Parity...';
      case STATUS.NOINTERNET:
        return 'Poor connection';
      case STATUS.RUNNING:
        return 'Running...';
      case STATUS.SYNCING:
        return 'Syncing...';
      default:
        return '';
    }
  };
}

export default Overlays;
