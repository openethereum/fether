// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React, { Component } from 'react';
import { chainName$ } from '@parity/light.js';
import store from 'store';
import { withProps } from 'recompose';

import ethereumIcon from '../assets/img/tokens/ethereum.png';
import LS_PREFIX from '../stores/utils/lsPrefix';

import Debug from '../utils/debug';

const debug = Debug('TokensContext');

const LS_KEY = `${LS_PREFIX}::tokens`;

const DEFAULT_TOKENS = {
  ETH: {
    address: 'ETH',
    decimals: 18,
    logo: ethereumIcon,
    name: 'Ether',
    symbol: 'ETH'
  }
};

const TokensContext = React.createContext({
  accountAddress: null,
  chainName: null,
  tokens: {},
  setChainName: null,
  fetchTokensFromLS: null,
  addToken: null,
  removeToken: null
});

class WithTokens extends Component {
  constructor (props) {
    super(props);

    this.state = {
      accountAddress: props.accountAddress,
      chainName: null,
      tokens: {},
      fetchTokensFromLS: () => {
        debug(
          `Fetching tokens for account ${this.state.accountAddress} and chain ${
            this.state.chainName
          }`
        );
        const lsKey = this.getLsKey();
        const tokensFromLS = store.get(lsKey);

        if (tokensFromLS) {
          debug(`Got tokens from localStorage`, tokensFromLS);
          this.setState({ tokens: tokensFromLS });
        } else {
          // If there's nothing in the localStorage, we add by default only
          // Ethereum. We consider Ethereum as a token, with address 'ETH'
          debug(`No tokens in localStorage; setting default.`);
          store.set(lsKey, DEFAULT_TOKENS);
          this.setState({ tokens: DEFAULT_TOKENS });
        }
      },
      addToken: (address, token) => {
        const newTokens = { ...this.state.tokens, [address]: token };
        store.set(this.getLsKey(), newTokens);
        this.setState({ tokens: newTokens });
      },
      removeToken: address => {
        const { [address]: _, ...newTokens } = this.state.tokens;
        store.set(this.getLsKey(), newTokens);
        this.setState({ tokens: newTokens });
      }
    };
  }

  componentDidMount = () => {
    chainName$({ withoutLoading: true }).subscribe(chainName => {
      this.setState({ chainName }, this.state.fetchTokensFromLS);
    });
  };

  // We have one key per chain per account, in this format:
  // __paritylight::tokens::0x123::kovan
  getLsKey = () =>
    `${LS_KEY}::${this.state.accountAddress}::${this.state.chainName}`;

  render () {
    const { Component, ...propsRest } = this.props;

    return (
      <TokensContext.Provider value={this.state}>
        <Component {...propsRest} />
      </TokensContext.Provider>
    );
  }
}

// Decorated class needs to have an accountAddress prop
export const provideTokens = Component => withProps({ Component })(WithTokens);

const mapContextToProps = ({ tokens, addToken, removeToken }) => ({
  tokens,
  tokensArray: Object.values(tokens),
  tokensArrayWithoutEth: Object.values(tokens).filter(
    ({ address }) => address !== 'ETH' // Ethereum is the only token without address, has 'ETH' instead
  ),
  addToken: addToken,
  removeToken: removeToken
});

export const consumeTokens = Component => props => {
  return (
    <TokensContext.Consumer>
      {context => <Component {...props} {...mapContextToProps(context)} />}
    </TokensContext.Consumer>
  );
};
