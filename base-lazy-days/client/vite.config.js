import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // to match server expectation
    port: 3000,
    // exit if port 3000 is in use (to avoid CORS errors)
    strict: true,
  },
});
