// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import withHealth, { STATUS } from '../utils/withHealth';
import loading from '../assets/img/icons/loading.svg';
import { HealthModal } from './HealthModal';

function statusMatches (status, require) {
  const isSync = status === STATUS.GOOD;

  const isNodeConnectedWithInternet =
    status !== STATUS.DOWNLOADING &&
    status !== STATUS.LAUNCHING &&
    status !== STATUS.NO_NODE_CONNECTED_AND_NO_INTERNET &&
    status !== STATUS.NODE_CONNECTED_AND_NO_INTERNET;

  const isNodeConnectedNoInternet =
    isSync ||
    status === STATUS.NODE_CONNECTED_AND_NO_INTERNET ||
    status === STATUS.NO_CLOCK_SYNC ||
    status === STATUS.NO_PEERS ||
    status === STATUS.SYNCING;

  switch (require) {
    case 'connected-offline':
      return isNodeConnectedNoInternet;
    case 'connected':
      return isNodeConnectedWithInternet;
    case 'sync':
      return isSync;
    default:
      throw new Error(
        `Status '${status}' must be one of 'connected-offline|connected|sync'.`
      );
  }
}

@withHealth
class RequireHealthOverlay extends Component {
  static propTypes = {
    require: PropTypes.oneOf(['connected-offline', 'connected', 'sync']),
    fullscreen: PropTypes.bool
  };

  state = {
    visible: false
  };

  componentDidMount () {
    this.updateVisibility();
  }

  componentDidUpdate () {
    this.updateVisibility();
  }

  updateVisibility = () => {
    if (statusMatches(this.props.health.status, this.props.require)) {
      if (this.state.visible !== false) {
        this.setState({ visible: false });
      }
    } else {
      if (this.state.visible === false) {
        this.setState({ visible: true });
      }
    }
  };

  render () {
    const { visible } = this.state;
    const {
      children,
      fullscreen,
      health: { status, payload }
    } = this.props;

    return (
      <HealthModal
        fullscreen={fullscreen}
        healthPercentage={payload && payload.percentage}
        healthStatus={status}
        loading={loading}
        visible={visible}
      >
        {children}
      </HealthModal>
    );
  }
}

export default RequireHealthOverlay;
