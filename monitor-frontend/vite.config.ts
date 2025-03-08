import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173,
        strictPort: true // Isso fará com que o Vite falhe se a porta 5173 não estiver disponível, ao invés de tentar outra porta
    }
})