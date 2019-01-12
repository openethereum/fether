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
  link,
  loading,
  navigateTo,
  title,
  visible
}) => (
  <div className='alert-wrapper'>
    <SUIModal
      className='alert-screen-wrapper' // {`alert-screen-wrapper ${fullscreen ? '-full-screen' : ''}`}
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
            {/* <SUIHeader>{title}</SUIHeader> */}
            <h1>{title}</h1>
            <p>{description}</p>
            <p>{link || null}</p>
          </SUIModal.Description>
          {navigateTo || null}
        </SUIModal.Content>
      </div>
    </SUIModal>
    <div>{children || 'hello world'}</div>
  </div>
);

Modal.propTypes = {
  children: PropTypes.node,
  description: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  fullscreen: PropTypes.bool,
  link: PropTypes.node,
  loading: PropTypes.any.isRequired,
  navigateTo: PropTypes.node,
  title: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  visible: PropTypes.bool
};
