import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src', // src 폴더를 @로 참조
    },
  },
  server: {
    // server 설정 추가
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // 백엔드 서버 주소
        changeOrigin: true,
      },
    },
  },
});
