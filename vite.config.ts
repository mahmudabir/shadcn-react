import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
import tailwindcss from "@tailwindcss/vite"

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  const nodeEnv = env['VITE_NODE_ENV'];
  const baseApiUrl = env['VITE_BASE_API_URL'];
  // const isProduction = nodeEnv === 'production';
  console.log('VITE_NODE_ENV: ', nodeEnv);
  console.log('VITE_BASE_API_URL: ', baseApiUrl);

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      proxy: {
        '/api': {
          target: baseApiUrl,
          changeOrigin: true,
        }
      }
    }
  };
});
