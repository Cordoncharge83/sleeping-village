import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({base:'/village/',plugins:[react()],server:{port:5173,strictPort:true},build:{chunkSizeWarningLimit:2400,rollupOptions:{output:{manualChunks(id){if(id.includes('@dimforge'))return 'physics';if(id.includes('node_modules/three/')||id.includes('node_modules\\three\\'))return 'three';}}}}});
