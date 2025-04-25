import { CHAIN, TRANSPORTS, SWELL_TESTNET_TRANSPORTS } from "@/config";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { swellTestnet } from "@/config/chains";

export const wagmiConfig = getDefaultConfig({
  chains: [CHAIN, swellTestnet],
  transports: {
    [CHAIN.id]: TRANSPORTS,
    [swellTestnet.id]: SWELL_TESTNET_TRANSPORTS,
  },
  ssr: true,
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!,
  appName: "Sigma Finance",
  appDescription: "Sigma Finance gives every DeFi user a quant desk in their pocket—deposit once, let AI hunt the yield.",
  appUrl: process.env.NEXT_PUBLIC_URL!,
  appIcon: `${process.env.NEXT_PUBLIC_URL}/icon.png`,
});
