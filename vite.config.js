import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
    base:"/salubrity-tenant/",
  server: {
    port: 5174, // Change to your desired port
    host: true, // Optional: makes it accessible from network
  }
});
