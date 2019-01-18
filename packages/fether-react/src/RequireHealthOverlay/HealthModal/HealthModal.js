// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'fether-ui';

import { STATUS } from '../../utils/withHealth';

class HealthModal extends Component {
  static propTypes = {
    children: PropTypes.node,
    fullscreen: PropTypes.bool,
    healthPercentage: PropTypes.object,
    healthStatus: PropTypes.symbol,
    loading: PropTypes.any.isRequired,
    visible: PropTypes.bool
  };

  render () {
    const { children, fullscreen, loading, visible } = this.props;

    return (
      <Modal
        description={this.renderDescription()}
        fullscreen={fullscreen}
        loading={loading}
        title={this.renderTitle()}
        visible={visible}
      >
        {children}
      </Modal>
    );
  }

  renderTitle = () => {
    const { healthStatus } = this.props;

    switch (healthStatus) {
      case STATUS.CLOCKNOTSYNC:
        return 'Your clock is not in sync';
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
    const { healthPercentage, healthStatus } = this.props;

    switch (healthStatus) {
      case STATUS.CLOCKNOTSYNC:
        return `Mac: System Preferences -> Date & Time -> Uncheck and recheck "Set date and time automatically"
        Windows: Control Panel -> "Clock, Language, and Region" -> "Date and Time" -> Uncheck and recheck "Set date and time automatically"`;
      case STATUS.SYNCING:
      case STATUS.DOWNLOADING:
        return healthPercentage && healthPercentage.gt(0)
          ? `${healthPercentage.toFixed(0)}%`
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
