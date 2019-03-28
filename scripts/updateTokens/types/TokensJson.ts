export interface RawTokenJSON {
  name?: string;
  symbol?: string;
  address?: string;
  decimals?: number | string;
}

export interface ValidatedTokenJSON {
  name: string;
  symbol: string;
  address: string;
  decimals: number | string;
  logo: tokenLogo;
}

export interface tokenLogo {
  src: string;
}

export interface NormalizedTokenJSON {
  name: string;
  symbol: string;
  address: string;
  decimals: number;
  logo?: string;
}
