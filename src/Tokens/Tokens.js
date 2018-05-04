// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { defaultAccount$, nodeHealth$ } from '@parity/light.js';
import { Redirect } from 'react-router-dom';

import EthBalance from './EthBalance';
import light from '../hoc';
import TokenBalance from './TokenBalance';

@inject('parityStore', 'tokensStore')
@observer
@light({
  me: defaultAccount$,
  nodeHealth: nodeHealth$
})
class Tokens extends Component {
  render() {
    const {
      me,
      nodeHealth,
      parityStore: { isApiConnected },
      tokensStore: { tokens }
    } = this.props;

    if (!isApiConnected) {
      return <Redirect to="/loading" />;
    }

    return (
      <div className="box -scroller">
        <ul className="list -tokens">
          {me &&
            Array.from(tokens.keys()).map(key => (
              <li key={key}>
                {key === 'ETH' ? (
                  <EthBalance address={me} token={key} {...tokens.get(key)} />
                ) : (
                  <TokenBalance address={me} token={key} {...tokens.get(key)} />
                )}
              </li>
            ))}

          {/* @brian the following 3 <li> are just to show what data I have from the backend, remove them whenever you want */}
          <li>
            <p>1. DL and install parity Status</p>

            <pre>OK, parity installed and running</pre>
          </li>

          {nodeHealth && (
            <li>
              <p>2. Overall node health status</p>
              <pre>
                PEERS: {nodeHealth.peers.status} {nodeHealth.peers.details[0]}/{
                  nodeHealth.peers.details[1]
                }
                <br />SYNC: {nodeHealth.sync.status}
                <br />TIMESYNC: {nodeHealth.time.status}
              </pre>
              <p>
                Note: I can make a small algorithm which outputs the average
                health with 3 states: OK, ALRIGHT, and BAD
              </p>
            </li>
          )}

          {nodeHealth && (
            <li>
              <p>
                3. When SYNC above is false, we have the syncing progress to
                give an idea how much time it'll take
              </p>
              <pre>
                "startingBlock": 900<br />"currentBlock": 902<br />
                "highestBlock": 1108
              </pre>
            </li>
          )}
        </ul>
      </div>
    );
  }
}

export default Tokens;
