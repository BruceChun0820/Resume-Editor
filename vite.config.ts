import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // 启用 Tailwind v4
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // 配置路径别名
    },
  },
})
