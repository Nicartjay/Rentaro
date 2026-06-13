import { defineConfig } from 'vite'

// Deployed at the domain root: https://rentaro.nicart.space
// `base: '/'` keeps asset URLs absolute from the root.
export default defineConfig({
  base: '/',
  server: {
    open: true,
    port: 5173,
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
  },
})
