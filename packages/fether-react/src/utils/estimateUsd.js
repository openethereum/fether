
/**
 * Estimate ETHUSD
 */

export const estimateUSD = () => {
      return fetch('https://api.etherscan.io/api?module=stats&action=ethprice')
            .then(data => data.json())
            .then((data) => {return data.result.ethusd });
};
