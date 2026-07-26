import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [], // ✅ ДОБАВИЛИ ЭТУ СТРОЧКУ! Cloudflare теперь сможет внедрить свои настройки  
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    rollupOptions: {
      output: {
        // ✅ Новый формат для Vite 6 (функция вместо объекта)
        manualChunks(id) {
          if (id.includes('@telegram-apps/sdk') || id.includes('@tonconnect/ui')) {
            return 'vendor';
          }
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
