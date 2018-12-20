// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React from 'react';

import feedback from '../assets/img/icons/feedback.svg';

const feedbackUrl = 'https://github.com/paritytech/fether/issues/new';

export const Feedback = () => (
  <div className='feedback_icon'>
    <a href={feedbackUrl} target='_blank'>
      <img alt='Feedback' src={feedback} />
    </a>
  </div>
);
