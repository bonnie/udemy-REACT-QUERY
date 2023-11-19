/* eslint-disable no-undef */
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    // this points to the setup file
    setupFiles: "./src/setupTests.js",
  },
  server: {
    // to match server expectation
    port: 3000,
    // exit if port 3000 is in use (to avoid CORS errors)
    strict: true,
  },
  resolve: {
    alias: {
      "@shared": path.join(__dirname, "../shared/"),
      "@": path.join(__dirname, "src/"),
    },
  },
});
