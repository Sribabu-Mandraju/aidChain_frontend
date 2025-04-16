import React from "react";
import { createRoot } from "react-dom/client";
import { WagmiProvider, createConfig, http } from "wagmi";
import { base, baseSepolia } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WalletProvider } from "@coinbase/onchainkit/wallet";
import { coinbaseWallet } from "wagmi/connectors";
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
          position="top-center"
          containerClassName="mt-4"
          toastOptions={{
            className: 'toast-container',
            style: {
              background: 'linear-gradient(135deg, #ffffff, #f1f5f9)',
              color: '#1f2937',
              borderRadius: '12px',
              padding: '12px 20px',
              fontSize: '16px',
              fontFamily: 'Inter, sans-serif',
              boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
              marginTop: '16px',
              transition: 'transform 0.2s ease-in-out',
              minWidth: '300px',
              maxWidth: '400px',
              border: '1px solid #e5e7eb',
            },
            success: {
              style: {
                background: 'linear-gradient(135deg, #10B981, #059669)',
                color: '#ffffff',
                border: 'none',
              },
              iconTheme: {
                primary: '#ffffff',
                secondary: '#10B981',
              },
            },
            error: {
              style: {
                background: 'linear-gradient(135deg, #EF4444, #DC2626)',
                color: '#ffffff',
                border: 'none',
              },
              iconTheme: {
                primary: '#ffffff',
                secondary: '#EF4444',
              },
            },
            loading: {
              style: {
                background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
                color: '#ffffff',
                border: 'none',
              },
              iconTheme: {
                primary: '#ffffff',
                secondary: '#3B82F6',
              },
            },
          }}
        />
      </WalletProvider>
    </QueryClientProvider>
  </WagmiProvider>
);