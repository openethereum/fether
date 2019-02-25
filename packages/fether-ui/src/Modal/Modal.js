// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React from 'react';
import PropTypes from 'prop-types';
import { Image as SUIImage, Modal as SUIModal } from 'semantic-ui-react';

export const Modal = ({
  buttons,
  children,
  description,
  fullscreen,
  icon,
  link,
  title,
  visible
}) => (
  <div className='alert-wrapper'>
    <SUIModal
      className={`alert-screen-wrapper ${fullscreen ? '-full-screen' : ''}`}
      open={visible}
    >
      <div className={`alert-screen ${fullscreen ? '-full-screen' : ''}`}>
        <SUIModal.Content image className='alert-screen-content'>
          {icon && (
            <SUIImage
              alt='loading'
              className='alert-screen_image'
              size='medium'
              src={icon}
              wrapped
            />
          )}
          <SUIModal.Description className='alert-screen_text'>
            <h1>{title}</h1>
            <p>{description}</p>
            <p>{link || null}</p>
          </SUIModal.Description>
          {buttons || null}
        </SUIModal.Content>
      </div>
    </SUIModal>
    {children}
  </div>
);

Modal.propTypes = {
  buttons: PropTypes.node,
  children: PropTypes.node,
  description: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  fullscreen: PropTypes.bool,
  icon: PropTypes.string,
  link: PropTypes.node,
  title: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  visible: PropTypes.bool
};
