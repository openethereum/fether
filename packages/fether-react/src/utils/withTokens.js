// Copyright 2015-2019 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import { chainName$ } from '@parity/light.js';
import { compose, mapPropsStream, withHandlers, withProps } from 'recompose';
import light from '@parity/light.js-react';
import localForage from 'localforage';
import { map, switchMap } from 'rxjs/operators';

import ethereumIcon from '../assets/img/tokens/ethereum.png';
import classicIcon from '../assets/img/tokens/classic.svg';
import localForage$ from './localForage';
import LS_PREFIX from '../stores/utils/lsPrefix';
import withAccount from './withAccount';
import { isErc20TokenAddress } from './chain';

const LS_KEY = `${LS_PREFIX}::tokens`;

const DEFAULT_ETC_TOKENS = {
  ETC: {
    address: 'ETC',
    decimals: 18,
    logo: classicIcon,
    name: 'Ether',
    symbol: 'ETC'
  }
};

const DEFAULT_ETH_TOKENS = {
  ETH: {
    address: 'ETH',
    decimals: 18,
    logo: ethereumIcon,
    name: 'Ether',
    symbol: 'ETH'
  }
};

// We have one key per chain per account, in this format:
// __paritylight::tokens::0x123::kovan
const getLsKey = ({ account: { address }, chainName }) =>
  `${LS_KEY}::${address}::${chainName}`;

/**
 * HOC which injects the user's whitelisted tokens (stored in localStorage).
 */
const withTokens = compose(
  // Inject chainName and accountAddress into props
  light({
    chainName: () => chainName$()
  }),
  withAccount,
  // mapPropsStream and add localForage$
  mapPropsStream(
    switchMap(props =>
      localForage$(getLsKey(props)).pipe(
        map(tokens => ({
          ...props,
          tokens:
            tokens ||
            (props.chainName === 'classic'
              ? DEFAULT_ETC_TOKENS
              : DEFAULT_ETH_TOKENS)
        }))
      )
    )
  ),
  // Also compute some related props related to tokens
  withProps(({ tokens }) => {
    const tokensArray = Object.values(tokens);

    return {
      tokensArray,
      tokensArrayWithoutEth: tokensArray.filter(
        // Ethereum and Ethereum Classic are the only tokens without address, has 'ETH' or 'ETC' instead
        ({ address }) => isErc20TokenAddress(address)
      )
    };
  }),
  // Add handlers to add/remove tokens
  withHandlers({
    addToken: props => (address, token) => {
      const newTokens = { ...props.tokens, [address]: token };
      return localForage.setItem(getLsKey(props), newTokens);
    },
    removeToken: props => address => {
      const { [address]: _, ...newTokens } = props.tokens;
      return localForage.setItem(getLsKey(props), newTokens);
    }
  })
);

export default withTokens;
