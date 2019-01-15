// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import styled from 'styled-components';

const DivContent = styled.div`
  margin: 0 auto;
  max-width: 22rem;
  overflow: visible;
`;

const DivWindow = styled.div`
  background: ${props => props.theme.chrome};
  border-radius: 0.25rem;
  box-shadow: 0 0.125rem 0.75rem rgba(${props => props.theme.black}, 0.175),
    0 0.125rem 0.125rem rgba(${props => props.theme.black}, 0.1);
  min-height: 15rem;
  overflow: hidden;
  position: relative;
`;

export { DivContent, DivWindow };
