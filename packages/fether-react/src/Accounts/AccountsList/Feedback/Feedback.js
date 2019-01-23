// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React from 'react';

export const Feedback = ({ accountsListLength }) => (
  <a
    className={`feedback ${process.platform === 'win32' ? '-windows' : ''}`}
    href='https://github.com/paritytech/fether/issues/new'
    rel='noopener noreferrer'
    target='_blank'
    // On Windows when Fether menu is show the Feedback button is pushed down out of view
    style={{
      marginBottom:
        accountsListLength > 1
          ? process.platform === 'win32'
            ? '18px'
            : '-2px'
          : process.platform === 'win32'
            ? '15px'
            : '-10px'
    }}
  >
    Feedback
  </a>
);
