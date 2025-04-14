import React from "react";
import { createRoot } from "react-dom/client";
import { WagmiProvider, createConfig, http } from "wagmi";
import { base, baseSepolia } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WalletProvider } from "@coinbase/onchainkit/wallet";
import { coinbaseWallet } from "wagmi/connectors"; // Import connector
import { Toaster } from "react-hot-toast";
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
        <Toaster
        position="top-center" // Changed position to top-center
        toastOptions={{
          // Optional: Adjust styles if needed
          style: {
            background: '#fff',
            color: '#333',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            marginTop: '10px', // Add some margin from the top edge
          },
          success: {
            style: {
              background: '#10B981',
              color: '#fff',
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#10B981',
            },
          },
          error: {
            style: {
              background: '#EF4444',
              color: '#fff',
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#EF4444',
            },
          },
          loading: {
            style: {
              background: '#3B82F6',
              color: '#fff',
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#3B82F6',
            },
          },
        }}
      />

      </WalletProvider>
    </QueryClientProvider>
  </WagmiProvider>
);