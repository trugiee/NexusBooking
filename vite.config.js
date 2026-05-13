import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  server: {
    port: 5180,
    host: true,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3006',
        changeOrigin: true,
      }
    }
  }
})
