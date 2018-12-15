import { chainName$, withoutLoading } from '@parity/light.js';
import { compose, mapPropsStream, withHandlers, withProps } from 'recompose';
import light from '@parity/light.js-react';
import localForage from 'localforage';
import { map, switchMap } from 'rxjs/operators';

import ethereumIcon from '../assets/img/tokens/ethereum.png';
import localForage$ from './localForage';
import LS_PREFIX from '../stores/utils/lsPrefix';
import withAccount from './withAccount';

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
    chainName: () => chainName$().pipe(withoutLoading())
  }),
  withAccount,
  // mapPropsStream and add localForage$
  mapPropsStream(
    switchMap(props =>
      localForage$(getLsKey(props)).pipe(
        map(tokens => ({ ...props, tokens: tokens || DEFAULT_TOKENS }))
      )
    )
  ),
  // Also compute some related props related to tokens
  withProps(({ tokens }) => {
    const tokensArray = Object.values(tokens);
    return {
      tokensArray,
      tokensArrayWithoutEth: tokensArray.filter(
        ({ address }) => address !== 'ETH' // Ethereum is the only token without address, has 'ETH' instead
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
