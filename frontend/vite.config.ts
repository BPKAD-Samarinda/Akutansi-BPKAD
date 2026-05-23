import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "node:path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    allowedHosts: true,
    proxy: {
      "/api": {
        target: "http://localhost/Akutansi-BPKAD/backend",
        rewrite: (path) => path.replace(/^\/api/, ""),
        changeOrigin: true,
      },
      "/backend/uploads": {
        target: "http://localhost/Akutansi-BPKAD",
        changeOrigin: true,
      },
      "/uploads": {
        target: "http://localhost/Akutansi-BPKAD",
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
