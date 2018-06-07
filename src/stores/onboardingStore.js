// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import { accountsInfo$ } from '@parity/light.js';
import { action, computed, observable } from 'mobx';
import { map } from 'rxjs/operators';
import store from 'store';

import LS_PREFIX from './utils/lsPrefix';

const LS_KEY = `${LS_PREFIX}::firstRun`;

class OnboardingStore {
  @observable hasAccounts; // If the user has at least 1 account or not
  @observable isFirstRun; // If it's the 1st time the user is running the app

  constructor () {
    const isFirstRun = store.get(LS_KEY);

    if (isFirstRun === undefined) {
      // Set store property to true.
      this.setIsFirstRun(true);
    } else {
      this.setIsFirstRun(isFirstRun);
    }

    accountsInfo$()
      .pipe(map(accounts => Object.keys(accounts).length > 0))
      .subscribe(this.setHasAccounts);
  }

  /**
   * We show the onboarding process if:
   * - either it's the 1st time the user runs this app
   * - or the user has 0 account
   */
  @computed
  get isOnboarding () {
    // If either of the two is undefined, then it means we're still fetching.
    // This doesn't count as onboarding.
    return this.hasAccounts === undefined || this.isFirstRun === undefined
      ? false
      : !this.hasAccounts || this.isFirstRun;
  }

  @action
  setHasAccounts = hasAccounts => {
    this.hasAccounts = hasAccounts;
  };

  @action
  setIsFirstRun = isFirstRun => {
    this.isFirstRun = isFirstRun;
    this.updateLS();
  };

  updateLS = () => store.set(LS_KEY, this.isFirstRun);
}

export default new OnboardingStore();
