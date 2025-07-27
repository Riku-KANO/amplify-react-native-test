import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./test-setup.ts'],
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: ['node_modules', 'dist', '.expo', 'amplify'],
  },
  resolve: {
    alias: {
      '@': '.',
      'react-native': 'react-native-web',
    },
  },
  define: {
    __DEV__: true,
  },
});
