// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React, { Component } from 'react';

import withHealth, { STATUS } from '../../utils/withHealth';

import loading from '../../assets/img/icons/loading.svg';

@withHealth
class RequireSyncOverlay extends Component {
  state = {
    visible: false // false | true | id of the timeout that will make the overlay visible
    // We want to display the overlay after 2s of problematic health. Syncing
    // to new blocks from the top of the chain takes 1s and we don't want to
    // display the overlay in that case.
  };

  componentDidMount () {
    // Initial render check. Display overlay immediately if problematic health.
    if (this.props.health.status !== STATUS.GOOD) {
      this.setState({ visible: true });
    }
  }

  componentDidUpdate () {
    if (this.props.health.status === STATUS.GOOD) {
      // If there is an ongoing timeout to make the overlay visible, clear it
      if (typeof this.state.visible === 'number') {
        clearTimeout(this.state.visible);
      }

      if (this.state.visible !== false) {
        this.setState({ visible: false });
      }
    } else {
      // Bad node health
      // Display the overlay after 2s (if there is no ongoing timeout)
      if (this.state.visible === false) {
        this.setState({
          visible: setTimeout(() => {
            this.setState({ visible: true });
          }, 2000)
        });
      }
    }
  }

  componentWillUnmount () {
    if (typeof this.state.visible === 'number') {
      clearTimeout(this.state.visible);
    }
  }

  render () {
    const { visible } = this.state;

    return visible === true ? (
      <div className='alert-screen -full-screen'>
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
    ) : (
      this.props.children
    );
  }

  renderTitle = () => {
    const {
      health: { status }
    } = this.props;

    switch (status) {
      case STATUS.CLOCKNOTSYNC:
        return 'Your clock is not sync';
      case STATUS.DOWNLOADING:
        return 'Downloading Parity...';
      case STATUS.NOINTERNET:
        return 'No Internet connection';
      case STATUS.NOPEERS:
        return 'Bad connectivity';
      case STATUS.LAUNCHING:
        return 'Connecting to the node...';
      case STATUS.SYNCING:
        return 'Syncing...';
      default:
        return '';
    }
  };

  renderDescription = () => {
    const {
      health: { status, payload }
    } = this.props;

    switch (status) {
      case STATUS.CLOCKNOTSYNC:
        return `Mac: System Preferences -> Date & Time -> Uncheck and recheck
        "Set date and time automatically"
        Windows: Control Panel -> "Clock, Language, and Region" -> "Date
        and Time" -> Uncheck and recheck "Set date and time automatically"`;
      case STATUS.SYNCING:
      case STATUS.DOWNLOADING:
        return payload && payload.percentage && payload.percentage.gt(0)
          ? `${payload.percentage.toFixed(0)}%`
          : '';
      case STATUS.NOINTERNET:
        return 'Please connect to the Internet';
      case STATUS.NOPEERS:
        return 'Getting some more peers...';
      default:
        return '';
    }
  };
}

export default RequireSyncOverlay;
