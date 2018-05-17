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
  logo: { src: string };
}

export interface NormalizedTokenJSON {
  name: string;
  symbol: string;
  address: string;
  decimal: number;
  logo?: string;
}
