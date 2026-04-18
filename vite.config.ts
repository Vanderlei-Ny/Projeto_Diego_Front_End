import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
// Proxy: em dev, use baseURL `/api` no axios para o front sempre falar com o mesmo host:porta
// (evita 404/CORS ao misturar localhost com IP da LAN).
// Não definir COOP/COEP aqui: o padrão (sem header) é o mais compatível com Google Sign-In / postMessage.
export default defineConfig({
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    proxy: {
      "/api": {
        target: process.env.VITE_DEV_API_PROXY ?? "http://127.0.0.1:3001",
        changeOrigin: true,
      },
    },
  },
});
