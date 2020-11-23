export interface ITokenConfig {
  address: string
  name?: string
  symbol?: string
  network: number
}
export const TokensToWatch: ITokenConfig[] = [
  {
    address: "0x6b175474e89094c44da98b954eedeac495271d0f",
    name: "DAI",
    symbol: "DAI",
    network: 1,
  },
]
