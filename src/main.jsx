// In main.jsx or App.jsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ThirdwebProvider } from "thirdweb/react";

// other imports

// Create a client
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {" "}
    <ThirdwebProvider
      activeChain="ethereum" // or your preferred chain
      clientId="6d1bf7da64bebfb8c1d07dcc2f72c2f1" // if using thirdweb services
    >
      <App />
    </ThirdwebProvider>{" "}
  </React.StrictMode>
);
