import { Chain } from '@rainbow-me/rainbowkit';

export const swellTestnet: Chain = {
  id: 1924, // Sepolia testnet ID
  name: 'Swell Testnet',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ['https://swell-testnet.alt.technology'] },
  },
  blockExplorers: {
    default: { name: 'Etherscan', url: 'https://swell-testnet-explorer.alt.technology/' },
  },
  testnet: true,
}; 