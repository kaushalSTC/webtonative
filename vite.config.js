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
    allowedHosts: ["picklebay.com", "www.picklebay.com"], // Explicitly allow the domain
  },
});
