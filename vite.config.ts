import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {rollupOptions: {output: {assetFileNames: asset => asset.names?.some(name=>name.endsWith('eng.traineddata.gz')) ? 'assets/ocr/eng.traineddata.gz' : 'assets/[name]-[hash][extname]'}}},
});
