import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import react from '@vitejs/plugin-react'
import EnvironmentPlugin from 'vite-plugin-environment';


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths(), EnvironmentPlugin('all')],
  server: {
    port: 3000
  },
  build: {
    outDir: "build"
  }
})
