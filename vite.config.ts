
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  server: {
    port: 8080,
    host: "::",
    allowedHosts: [
      "4b1d750b-b4b8-44f9-8690-a7026aa11c79.lovableproject.com"
    ]
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  }
}));
