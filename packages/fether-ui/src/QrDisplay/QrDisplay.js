// Copyright 2015-2019 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

// Original Source: https://github.com/polkadot-js/apps/pull/592

import React from 'react';
import qrcode from 'qrcode-generator';
import PropTypes from 'prop-types';

import { QrModal } from './QrModal/QrModal';

function getDataUrl (value) {
  const qr = qrcode(0, 'M');

  qr.addData(value, 'Byte');
  qr.make();

  return qr.createDataURL(16, 0);
}

export class QrDisplay extends React.PureComponent {
  state = {
    image: null,
    address: null
  };

  static getDerivedStateFromProps ({ value }, prevState) {
    const address = JSON.stringify(value).replace(/"/g, '');

    if (address === prevState.address) {
      return null;
    }

    return {
      image: getDataUrl(address),
      address
    };
  }

  render () {
    const { handleClose, visible } = this.props;
    const { address, image } = this.state;

    if (!address || !image) {
      return null;
    }

    return (
      <QrModal
        address={address}
        icon={image}
        handleClose={handleClose}
        visible={visible}
      />
    );
  }
}

QrDisplay.propTypes = {
  icon: PropTypes.string,
  handleClose: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  visible: PropTypes.bool
};
