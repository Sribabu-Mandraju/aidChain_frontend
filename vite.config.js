import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true, // Allows external access (e.g., mobile wallet testing)
    open: true, // Auto-open browser
  },
  define: {
    "process.env": {}, // Fix for Web3 libraries
  },
});