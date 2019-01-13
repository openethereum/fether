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
  blue: '#160DF6',
  chrome: '#f5f6f6',
  darkGrey: '#444444',
  eggshell: '#fff',
  faint: '#ddd',
  green: '#3ec28f',
  grey: '#888',
  mono: 'SFMono-Regular, Consolas, Liberation Mono, Menlo, Courier, monospace',
  purple: '#330044',
  red: '#C2473E',
  white: '#f9f9f9',
  yellow: '#DFCA29'
};

export { fetherTheme, GlobalStyle };
