// Copyright 2015-2019 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React, { Component } from 'react';
import light from '@parity/light.js-react';
import { Modal } from 'fether-ui';
import { startWith, catchError } from 'rxjs/operators';
import { versionInfo$ } from '@parity/light.js';
import { of } from 'rxjs';
import semver from 'semver';

import { parity } from 'fether/package.json';
const requiredVersion = parity.version;

@light({
  versionInfo: props =>
    versionInfo$().pipe(
      startWith(undefined),
      catchError(e => {
        /*
         * parity_versionInfo was implemented on the LC with Parity v2.4.1
         * If the RPC errors out, it means we're using Parity < v2.4.1

         * Checking the version of Parity Ethereum in Fether was first released
         * (Fether v0.3) along with a feature (#394) that requires Parity
         * Ethereum >= v2.4.0

         * Fether v0.3 should theoretically work with v2.4.0, but since there is
         * no way to check for this exact version, we made Fether v0.3 require
         * >= v2.4.1 (which we can check).
         *
         * If the RPC errors out, we're using Parity < v2.4.1 and Fether v0.3
         * is "officially" not compatible with this version.
         */
        return of({ version: { major: 0, minor: 0, patch: 0 } });
      })
    )
})
class RequireParityVersion extends Component {
  render () {
    const { versionInfo } = this.props;

    if (versionInfo) {
      const { major, minor, patch } = versionInfo.version;
      if (!semver.satisfies(`${major}.${minor}.${patch}`, requiredVersion)) {
        const friendlyVersion =
          major === 0 && minor === 0 && patch === 0
            ? '<2.4.1'
            : `${major}.${minor}.${patch}`;
        return (
          <Modal
            title='Unsupported version'
            description={`You are running Parity Ethereum ${friendlyVersion}, which is unsupported. Please upgrade to Parity Ethereum ${requiredVersion}`}
            visible
          />
        );
      }
    }

    return this.props.children;
  }
}

export default RequireParityVersion;
