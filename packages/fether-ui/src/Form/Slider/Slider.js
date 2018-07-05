// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React from 'react';

import { Field } from '../Field';

export const Slider = ({
  centerText,
  input,
  leftText,
  rightText,
  ...otherProps
}) => (
  <Field input={input} {...otherProps}>
    <nav className='range-nav'>
      <span className='range-nav_label'>{leftText}</span>
      <span className='range-nav_value'>{centerText}</span>
      <span className='range-nav_label'>{rightText}</span>
    </nav>
  </Field>
);
