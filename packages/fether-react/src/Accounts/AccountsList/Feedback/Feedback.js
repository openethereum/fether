// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React from 'react';

const feedbackUrl = 'https://github.com/paritytech/fether/issues/new';
const openFeedbackLink = () => {
  window.open(feedbackUrl, '_blank');
};

export const Feedback = () => (
  <div className='feedback' onClick={openFeedbackLink}>
    Feedback
  </div>
);
