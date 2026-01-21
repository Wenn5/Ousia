import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@ousia/core': path.resolve(__dirname, '../../packages/core/src'),
      '@ousia/web': path.resolve(__dirname, '../../packages/modules/web'),
      '@ousia/editor': path.resolve(__dirname, '../../packages/editor/src'),
      //'@ousia/modules': path.resolve(__dirname, '../../packages/modules/src'),
    },
  },
})
