import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/planet-portfolio/",
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          three: ["three"],
          r3f: ["@react-three/fiber", "@react-three/drei"],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    minify: "terser",
    terserOptions: {
      mangle: true,
      format: {
        comments: false,
      },
    },
  },
  optimizeDeps: {
    include: ["three", "@react-three/fiber", "@react-three/drei"],
  },
});
