import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // ✅ Short alias for `src`
    },
  },
  server: {
    watch: {
      usePolling: true,  // ✅ Fix for unwanted HMR reloads
      interval: 300,     // ✅ Reduce polling frequency
    },
    hmr: {
      overlay: false, // ✅ Stop Vite overlay errors from interrupting development
    },
    port: 5173, // ✅ Default Vite port (change if needed)
    open: true, // ✅ Auto-open browser on `npm run dev`
  },
  build: {
    sourcemap: false, // ✅ Disable sourcemaps for smaller production build
    minify: "esbuild", // ✅ Faster & smaller build
    chunkSizeWarningLimit: 500, // ✅ Avoid chunk size warnings
  },
});
