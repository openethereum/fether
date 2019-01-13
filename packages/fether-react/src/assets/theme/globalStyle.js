// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import { createGlobalStyle } from 'styled-components';

// https://www.styled-components.com/docs/faqs
const GlobalStyle = createGlobalStyle`
`;

const fetherTheme = {
  black: '#222',
  chrome: '#f5f6f6',
  darkGrey: '#444444',
  faint: '#ddd',
  mono: 'SFMono-Regular, Consolas, Liberation Mono, Menlo, Courier, monospace'
};

export { fetherTheme, GlobalStyle };
