import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  define: {
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'true',
  },
  resolve: {
    alias: {
      '@assets': path.resolve(__dirname, './src/assets'),
      // 巨坑--> 不能使用@types估计跟内部冲突
      '@utils': path.resolve(__dirname, './src/utils'),
    },
  },
  server: {
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:7070', // 代理的目标地址
        changeOrigin: true, // 是否更改请求的源
        rewrite: (path) => path.replace(/^\/api/, ''), // 重写请求路径
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        // 分包
        manualChunks: (id: string) => {
          if (id.includes('node_modules')) {
            return 'vendor'
          }
        },
      },
    },
  },
})