import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // ADD THIS BASE CONFIGURATION
  base: '/',
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      // This helps with routing issues
      input: {
        main: './index.html'
      }
    }
  }
})