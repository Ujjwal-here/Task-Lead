import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    open: true, // Automatically open browser
    hmr: {
      overlay: true, // Show error overlay
      port: 24678, // HMR port
    },
    fs: {
      allow: ["./", "./client", "./shared"],
      deny: [".env", ".env.*", "*.{crt,pem}", "**/.git/**"],
    },
    watch: {
      usePolling: false, // Use native file system events
      interval: 100, // Polling interval in ms
    },
  },
  build: {
    outDir: "dist",
    sourcemap: mode === "development", // Source maps in dev mode
  },
  plugins: [
    react({
      // Enable React Fast Refresh
      fastRefresh: true,
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
  // Optimize dependencies for faster hot reload
  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom"],
    exclude: [],
  },
  // CSS hot reload configuration
  css: {
    devSourcemap: true, // CSS source maps in dev
  },
}));
