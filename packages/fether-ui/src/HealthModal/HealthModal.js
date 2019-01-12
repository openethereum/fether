// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Modal } from '../Modal';

class HealthModal extends Component {
  static propTypes = {
    children: PropTypes.node,
    fullscreen: PropTypes.bool,
    health: PropTypes.object,
    healthStatusModes: PropTypes.object,
    loading: PropTypes.any.isRequired,
    visible: PropTypes.bool
  };

  render () {
    const { children, fullscreen, loading, visible } = this.props;

    return (
      <Modal
        children={children}
        description={this.renderDescription()}
        fullscreen={fullscreen}
        loading={loading}
        title={this.renderTitle()}
        visible={visible}
      />
    );
  }

  renderTitle = () => {
    const {
      health: { status },
      healthStatusModes: STATUS
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
      health: { status, payload },
      healthStatusModes: STATUS
    } = this.props;

    switch (status) {
      case STATUS.CLOCKNOTSYNC:
        return `Mac: System Preferences -> Date & Time -> Uncheck and recheck "Set date and time automatically"
        Windows: Control Panel -> "Clock, Language, and Region" -> "Date and Time" -> Uncheck and recheck "Set date and time automatically"`;
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

export { HealthModal };
