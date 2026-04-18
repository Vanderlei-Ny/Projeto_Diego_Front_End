import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

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
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Barbearia Diego Bueno",
        short_name: "Diego Bueno",
        description: "Agende e acompanhe seus atendimentos na barbearia.",
        start_url: "/",
        scope: "/",
        display: "standalone",
        theme_color: "#B8952E",
        background_color: "#0A0A0A",
        icons: [
          {
            src: "/logo.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
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
