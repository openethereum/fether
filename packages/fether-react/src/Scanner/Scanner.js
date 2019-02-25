// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React from 'react';
import QrSigner from '@parity/qr-signer';

import loading from '../assets/img/icons/loading.svg';

export default class Scanner extends React.PureComponent {
  state = {
    webcamError: null,
    isLoading: true
  };

  componentDidMount () {
    this.checkForWebcam();
    if (navigator.mediaDevices) {
      navigator.mediaDevices.addEventListener(
        'devicechange',
        this.checkForWebcam
      );
    }
  }

  componentWillUnmount () {
    if (navigator.mediaDevices && navigator.mediaDevices.ondevicechange) {
      navigator.mediaDevices.removeEventListener(
        'devicechange',
        this.checkForWebcam
      );
    }
  }

  checkForWebcam = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        await navigator.mediaDevices.getUserMedia({ video: true });
        this.setState({
          webcamError: null,
          isLoading: false
        });
      } catch (e) {
        let errorMessage;
        switch (e.name) {
          case 'NotAllowedError':
          case 'SecurityError':
            errorMessage = 'Access to the webcam was refused.';
            break;
          case 'NotFoundError':
          case 'OverconstrainedError':
            errorMessage = 'No webcam found on the device.';
            break;
          case 'NotReadableError':
            errorMessage =
              'Webcam hardware error. Try restarting your computer';
            break;
          default:
            errorMessage = 'Unknown error.';
        }
        this.setState({
          webcamError: errorMessage,
          isLoading: false
        });
      }
    }
  };

  render () {
    const { onScan, label } = this.props;
    const { webcamError, isLoading } = this.state;
    const size = 300;

    return (
      <React.Fragment>
        {isLoading ? (
          <img alt='loading' src={loading} />
        ) : webcamError ? (
          <p>{webcamError}</p>
        ) : (
          <div>
            <p>{label}</p>
            <QrSigner scan onScan={onScan} size={size} />
          </div>
        )}
      </React.Fragment>
    );
  }
}
