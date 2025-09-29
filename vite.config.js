import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    host: true,
    strictPort: true,
    port:5174
  },
  preview: {
    allowedHosts: ["dev.picklebay.com", "www.dev.picklebay.com"], // Explicitly allow the domain
  },
});
