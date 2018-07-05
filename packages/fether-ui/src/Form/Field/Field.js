// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React from 'react';
import { Popup } from 'semantic-ui-react';
import 'semantic-ui-css/components/popup.min.css';

export const Field = ({
  as: T = 'input',
  children,
  input,
  label,
  meta,
  ...otherProps
}) => (
  <div className='form_field'>
    <label>{label}</label>
    <Popup
      content={meta && (meta.error || meta.submitError)}
      inverted
      on='click'
      open={meta && !meta.pristine && !meta.valid && !meta.dirtySinceLastSubmit}
      position='top center'
      size='mini'
      trigger={<T {...input} {...otherProps} />}
    />

    {children}
  </div>
);
