// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

/* eslint-env jest */

import { getScreenResolution, shouldFixWindowPosition } from './window';

let smallScreenResolution, largeScreenResolution;

describe('window resolution', () => {
  beforeEach(() => {
    smallScreenResolution = {
      x: 1024,
      y: 768
    };

    largeScreenResolution = {
      x: 1366,
      y: 768
    };
  });

  test('should return previous resolution if it was defined and current resolution is the same', () => {
    const previousScreenResolution = largeScreenResolution;
    const currentScreenResolution = largeScreenResolution;
    const screenResolution = getScreenResolution(
      previousScreenResolution,
      currentScreenResolution
    );
    expect(screenResolution).toEqual(previousScreenResolution);
  });

  test('should return current resolution if either its x or y coordinate differs in the previous resolution', () => {
    const previousScreenResolution = largeScreenResolution;
    const currentScreenResolution = smallScreenResolution;
    const screenResolution = getScreenResolution(
      previousScreenResolution,
      currentScreenResolution
    );
    expect(screenResolution).toEqual(currentScreenResolution);
  });

  test('should return true to change resolution if previousScreenResolution is undefined', () => {
    const previousScreenResolution = undefined;
    const currentScreenResolution = smallScreenResolution;
    const recommendation = shouldFixWindowPosition(
      previousScreenResolution,
      currentScreenResolution
    );
    expect(recommendation).toEqual(true);
  });

  test('should return true to change resolution if either the x or y coordinate of the previousScreenResolution is greater than in the current resolution', () => {
    const previousScreenResolution = largeScreenResolution;
    const currentScreenResolution = smallScreenResolution;
    const recommendation = shouldFixWindowPosition(
      previousScreenResolution,
      currentScreenResolution
    );
    expect(recommendation).toEqual(true);
  });

  test('should return false to not change resolution if current resolution is larger than previous resolution', () => {
    const previousScreenResolution = smallScreenResolution;
    const currentScreenResolution = largeScreenResolution;
    const recommendation = shouldFixWindowPosition(
      previousScreenResolution,
      currentScreenResolution
    );
    expect(recommendation).toEqual(false);
  });

  test('should return false to not change resolution if current resolution is equal to the previous resolution', () => {
    const previousScreenResolution = smallScreenResolution;
    const currentScreenResolution = smallScreenResolution;
    const recommendation = shouldFixWindowPosition(
      previousScreenResolution,
      currentScreenResolution
    );
    expect(recommendation).toEqual(false);
  });
});
