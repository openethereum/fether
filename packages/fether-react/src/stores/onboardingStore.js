// Copyright 2015-2019 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import { action, observable } from 'mobx';
import store from 'store';

import LS_PREFIX from './utils/lsPrefix';

const LS_KEY = `${LS_PREFIX}::firstRun`;

export class OnboardingStore {
  @observable
  isFirstRun; // If it's the 1st time the user is running the app

  constructor () {
    const isFirstRun = store.get(LS_KEY);

    if (isFirstRun === undefined) {
      // Set store property to true.
      this.setIsFirstRun(true);
    } else {
      this.setIsFirstRun(isFirstRun);
    }
  }

  @action
  setIsFirstRun = isFirstRun => {
    this.isFirstRun = isFirstRun;
    this.updateLS();
  };

  updateLS = () => store.set(LS_KEY, this.isFirstRun);
}

export default new OnboardingStore();
