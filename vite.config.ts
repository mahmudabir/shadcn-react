import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
import tailwindcss from "@tailwindcss/vite"


// // https://vite.dev/config/
// export default defineConfig2({
//   plugins: [react(), tailwindcss()],
//   resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "./src"),
//     },
//   },
//   server: {
//     proxy: {
//       '/api': {
//         target: process.env.BASE_API_URL,
//         changeOrigin: true,
//         // optional: if your backend doesn't expect /api
//         // rewrite: (path) => path.replace(/^\/api/, ''),
//       },
//       '/auth': {
//         target: process.env.BASE_API_URL,
//         changeOrigin: true,
//       }
//     }
//   }
// })

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  const isProduction = env['NODE_ENV'] === 'production';
  console.log(isProduction);

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
          target: "http://localhost:5000",
          changeOrigin: true,
        }
      }
    }
  };
});
