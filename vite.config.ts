import process from 'node:process'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ArcoResolver } from 'unplugin-vue-components/resolvers'
import { defineConfig } from 'vite'
import Unocss from 'unocss/vite'

// See https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // See https://github.com/unplugin/unplugin-auto-import
    AutoImport({
      resolvers: [ArcoResolver()],
      imports: [
        'vue',
        '@vueuse/core',
      ],
      dts: './src/auto-imports.d.ts',
      dirs: [
        './src/composables',
      ],
    }),
    Components({
      dts: './src/components.d.ts',
      resolvers: [
        ArcoResolver({
          resolveIcons: true,
          sideEffect: false,
        }),
      ],
    }),
    Unocss(),
  ],
  define: {
    OS_PLATFORM: `"${process.platform}"`,
  },
  clearScreen: false,
  envPrefix: ['VITE_', 'TAURI_'],
  server: {
    port: 1420,
    strictPort: true,
  },
  build: {
    outDir: './dist',
    // See https://tauri.app/v1/references/webview-versions for details
    target: process.env.TAURI_PLATFORM === 'windows' ? 'chrome105' : 'safari15',
    minify: !process.env.TAURI_DEBUG ? 'esbuild' : false,
    sourcemap: !!process.env.TAURI_DEBUG,
    emptyOutDir: true,
  },
})
