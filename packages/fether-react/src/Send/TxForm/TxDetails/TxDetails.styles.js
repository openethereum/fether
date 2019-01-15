// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import styled, { css } from 'styled-components';
import { SlideLeftIn } from '../../../assets/theme/shared/animations/SlideLeftIn.styles';

const animationRuleSlideLeftIn = css`
  animation-name: ${SlideLeftIn}; /* required */
  animation-duration: 0.25s; /* required */
  animation-timing-function: ease-in;
  animation-delay: 0s;
  animation-iteration-count: 1;
  animation-direction: normal;
  animation-fill-mode: normal;
  animation-play-state: playing;
`;

const DivTxForm = styled.div`
  ${animationRuleSlideLeftIn};
  border-radius: 0.25rem;
  background: rgba(${props => props.theme.faint}, 0.25);
  margin: 0.5rem 0;
  position: relative;
`;

const LabelTextareaTxDetails = styled.label`
  color: ${props => props.theme.black};
  display: block;
  font-size: 0.7rem;
  font-weight: 600;
  opacity: 0.75;
  padding: 0.5rem 0.5rem 0;
`;

const TextareaTxDetails = styled.textarea`
  background: transparent;
  border: 0;
  color: ${props => props.theme.darkGrey};
  font-family: ${props => props.theme.mono};
  font-size: 0.6rem;
  font-weight: 400;
  height: 4.75rem;
  line-height: 1.3rem;
  margin-top: -0.25rem;
  opacity: 0.75;
  overflow: hidden;
  padding: 0.5rem;
  resize: none;
  width: calc(100% - 1rem);
  word-wrap: break-word;
`;

export { DivTxForm, LabelTextareaTxDetails, TextareaTxDetails };
