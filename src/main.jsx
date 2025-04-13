import React from "react";
import { createRoot } from "react-dom/client";
import { WagmiProvider, createConfig, http } from "wagmi";
import { base, baseSepolia } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WalletProvider } from "@coinbase/onchainkit/wallet";
import { coinbaseWallet } from "wagmi/connectors"; // Import connector
import App from "./App";

// Wagmi config with proper Coinbase Wallet connector
const config = createConfig({
  chains: [base, baseSepolia],
  connectors: [
    coinbaseWallet({
      appName: "Your App Name", // Replace with your app's name
      preference: "all", // Supports both Coinbase Wallet and Smart Wallet
    }),
  ],
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
});

const queryClient = new QueryClient();

const root = createRoot(document.getElementById("root"));
root.render(
  <WagmiProvider config={config}>
    <QueryClientProvider client={queryClient}>
      <WalletProvider>
        <App />
      </WalletProvider>
    </QueryClientProvider>
  </WagmiProvider>
);