import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";


export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },

  plugins: [
    react(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  // ⚡ BUILD OTIMIZADO
  build: {
    target: "es2017", // remove JS legado
    cssMinify: true,
    sourcemap: false,
    reportCompressedSize: true,

    // Reduz JS não usado
    minify: "esbuild",
    modulePreload: {
      polyfill: false,
    },

    // Melhor divisão de bundle → JS menor
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
        },
      },
    },

    // Aumenta limite de chunk para não dar warnings falsos
    chunkSizeWarningLimit: 600,
  },
}));
