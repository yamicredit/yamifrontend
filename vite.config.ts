import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // amazon-cognito-identity-js expects Node's `global`, which Vite doesn't polyfill.
  define: {
    global: 'globalThis',
  },
})
