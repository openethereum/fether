// Copyright 2015-2019 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React from 'react';
import PropTypes from 'prop-types';
import { Image as SUIImage, Modal as SUIModal } from 'semantic-ui-react';

export const QrModal = ({ address, handleClose, icon, visible }) => (
  <React.Fragment>
    <SUIModal
      className='qr-screen-wrapper'
      onClick={handleClose}
      open={visible}
    >
      <div className='qr-screen'>
        <SUIModal.Content image className='qr-screen-content'>
          {icon && (
            <SUIImage
              alt='loading'
              className='qr-screen_image'
              size='medium'
              src={icon}
              wrapped
            />
          )}
          <SUIModal.Description className='qr-screen_address account_address -narrow'>
            <p>{address}</p>
          </SUIModal.Description>
        </SUIModal.Content>
      </div>
    </SUIModal>
  </React.Fragment>
);

QrModal.propTypes = {
  address: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  handleClose: PropTypes.func,
  icon: PropTypes.string,
  visible: PropTypes.bool
};
