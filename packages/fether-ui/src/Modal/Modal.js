// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React from 'react';
import PropTypes from 'prop-types';
import {
  Header as SUIHeader,
  Image as SUIImage,
  Modal as SUIModal
} from 'semantic-ui-react';

export const Modal = ({
  children,
  description,
  fullscreen,
  loading,
  title,
  visible
}) => (
  <div className='alert-wrapper'>
    <SUIModal
      className={`alert-screen-wrapper ${fullscreen ? '-full-screen' : ''}`}
      open={visible}
    >
      <div className='alert-screen'>
        <SUIModal.Content image className='alert-screen-content'>
          <SUIImage
            wrapped
            alt='loading'
            size='medium'
            src={loading}
            className='alert-screen_image'
          />
          <SUIModal.Description className='alert-screen_text'>
            <SUIHeader>{title}</SUIHeader>
            <p>{description}</p>
          </SUIModal.Description>
        </SUIModal.Content>
      </div>
    </SUIModal>
    <div>{children}</div>
  </div>
);

Modal.propTypes = {
  children: PropTypes.node,
  description: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  fullscreen: PropTypes.bool,
  loading: PropTypes.bool,
  title: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  visible: PropTypes.bool
};
