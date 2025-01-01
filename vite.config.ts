import react from '@vitejs/plugin-react';
import {defineConfig} from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({command}) => ({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler', {target: '19'}]],
      },
    }),
  ],
  base: command === 'build' ? '/infinistg/' : '/',
}));
