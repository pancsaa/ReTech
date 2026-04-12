import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(),tailwindcss()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  server: {
    proxy: {
      "/api": {
        target: "http://backend:3000",
        changeOrigin: true,
        secure: false,
      },
      "/uploads": {
      target: "http://backend:3000",
      changeOrigin: true,
      secure: false,
    },
    },
  },

  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
  },
});