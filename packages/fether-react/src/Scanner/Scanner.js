// Copyright 2015-2019 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React from 'react';
import QrSigner from '@parity/qr-signer';

import i18n from '../i18n';
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
            errorMessage = i18n.t('ns1:scanner.error_security');
            break;
          case 'NotFoundError':
          case 'OverconstrainedError':
            errorMessage = i18n.t('ns1:scanner.error_overconstrained');
            break;
          case 'NotReadableError':
            errorMessage = i18n.t('ns1:scanner.error_not_readable');
            break;
          default:
            errorMessage = i18n.t('ns1:scanner.error_unknown');
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
