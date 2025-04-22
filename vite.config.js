import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { config } from 'dotenv'
import nodePolyfills from 'rollup-plugin-node-polyfills'

config()

export default defineConfig({
  plugins: [
    react(),
  ],
  define: {
    global: 'globalThis', // ✅ Fix for "global is not defined"
    'process.env': process.env,
  },
  resolve: {
    alias: {
      // Optional polyfills if needed by your packages
      stream: 'rollup-plugin-node-polyfills/polyfills/stream',
      util: 'rollup-plugin-node-polyfills/polyfills/util',
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis', // ✅ Also needed here
      },
    },
  },
  build: {
    rollupOptions: {
      plugins: [nodePolyfills()], // ✅ Add polyfill plugin for Node built-ins
    },
  },
})
