import { defineConfig } from 'vite';

export default defineConfig({
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['@telegram-apps/sdk', '@tonconnect/ui']
        }
      }
    }
  },
  server: {
    port: 3000,
    host: true
  },
  // Cloudflare Pages specific
  preview: {
    port: 8788,
    host: true
  }
});
