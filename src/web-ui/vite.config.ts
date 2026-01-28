import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000 // Set your desired port here
  },
  preview: {
    port: 8080 // Set port for the production preview server
  }
})
