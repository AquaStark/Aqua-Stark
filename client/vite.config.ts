import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { defineConfig } from 'vite';
import wasm from 'vite-plugin-wasm';
import react from '@vitejs/plugin-react';
import topLevelAwait from 'vite-plugin-top-level-await';
// import mkcert from 'vite-plugin-mkcert';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react(), wasm(), topLevelAwait()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  define: {
    global: 'globalThis',
  },
  optimizeDeps: {
    force: true,
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'starknet',
      '@starknet-react/core',
      '@dojoengine/core',
      '@dojoengine/sdk',
    ],
  },
  server: {
    // https: true, // Comentado temporalmente
    port: 5173,
    host: true,
    fs: {
      allow: ['..'],
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
        rewrite: path => path.replace(/^\/api/, '/api'),
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          dojo: [
            '@dojoengine/core',
            '@dojoengine/sdk',
            '@dojoengine/torii-client',
            '@dojoengine/torii-wasm',
          ],
          starknet: ['starknet', 'starknetkit', '@starknet-react/core'],
        },
      },
    },
  },
  preview: {
    port: 5173,
    host: true,
  },
  assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.svg'],
});
