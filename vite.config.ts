import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { resolve } from 'path';
import { externalizeDeps } from 'vite-plugin-externalize-deps'
// https://vitejs.dev/config/

const _dirname = dirname(fileURLToPath(import.meta.url))

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: resolve(_dirname, 'src/index.ts'),
      name: 'orbital-info',
      formats: ["es"],
      fileName: 'orbital-info',
    },
    copyPublicDir: false,
  },
  plugins: [react(), externalizeDeps()],
})
