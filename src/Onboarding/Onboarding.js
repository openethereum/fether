// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Redirect } from 'react-router-dom';

@inject('electronStore')
@observer
class Onboarding extends Component {
  render() {
    const {
      electronStore: { downloadProgress, isReady }
    } = this.props;

    if (isReady) {
      return <Redirect to="/" />;
    }

    return (
      <div className="box -scroller">
        <p>
          This is the Onboarding page.<br />
        </p>
        <ul className="list -tokens">
          <li>
            <p>1. DL and install parity</p>
            <pre>
              progress: {Math.round(downloadProgress * 100)}%<br />status:{' '}
              {this.renderStatus()}
            </pre>
          </li>
        </ul>
      </div>
    );
  }

  renderStatus = () => {
    const {
      electronStore: { isParityRunning }
    } = this.props;

    if (isParityRunning) {
      return 'Running parity...';
    } else {
      return 'Downloading...';
    }
  };
}

export default Onboarding;
