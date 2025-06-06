import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true, // or specify a string like '0.0.0.0'
    allowedHosts: ['https://7dd0-102-89-84-26.ngrok-free.app', 'localhost', '127.0.0.1'], // Vite 5.x+
  },
})