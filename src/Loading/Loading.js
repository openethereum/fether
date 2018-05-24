// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import React, { PureComponent } from 'react';
import { inject, observer } from 'mobx-react';
import { Redirect } from 'react-router-dom';

@inject('parityStore')
@observer
class Loading extends PureComponent {
  render () {
    const { parityStore: { downloadProgress, isApiConnected } } = this.props;

    if (isApiConnected) {
      return <Redirect to='/' />;
    }

    return (
      <div className='box -scroller'>
        <p>
          This is the Loading page.<br />
        </p>
        <ul className='list -tokens'>
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
    const { parityStore: { downloadProgress, isParityRunning } } = this.props;

    if (isParityRunning) {
      return 'Connecting to API...';
    } else if (downloadProgress) {
      return 'Downloading...';
    } else {
      // We should be in browser now
      return 'Please run:\nparity --light --ws-origins all';
    }
  };
}

export default Loading;
