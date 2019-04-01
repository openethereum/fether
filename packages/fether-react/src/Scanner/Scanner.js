// Copyright 2015-2019 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React from 'react';
import QrSigner from '@parity/qr-signer';
import { ExternalLink } from 'fether-ui';

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
            errorMessage = 'Webcam access was refused.';
            break;
          case 'NotFoundError':
          case 'OverconstrainedError':
            errorMessage = 'Webcam not found on the device.';
            break;
          case 'NotReadableError':
            errorMessage = 'Webcam permissions or hardware error.';
            break;
          default:
            errorMessage = 'Webcam unknown error.';
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
          <div>
            <p>
              {webcamError}&nbsp;Visit the&nbsp;
              <ExternalLink
                name='Fether FAQ'
                href='https://wiki.parity.io/Fether-FAQ#how-to-fix-a-webcam-error'
              />
              &nbsp;for help troubleshooting this issue.
            </p>
          </div>
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
