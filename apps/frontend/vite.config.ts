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
      '@ousia/common': path.resolve(__dirname, '../../packages/common/src'),
      '@ousia/tiptap': path.resolve(__dirname, '../../packages/tiptap/src'),
    },
  },
})
