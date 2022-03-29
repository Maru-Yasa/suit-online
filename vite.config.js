import path from 'path'
import { defineConfig } from 'vite'
import { createVuePlugin } from 'vite-plugin-vue2'
import visualizer from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    createVuePlugin(),
    visualizer()
  ],
  server: {
      port : 8080
  },
  resolve: {
    alias: [
      {
        find: '@',
        replacement: path.resolve(__dirname, 'src')
      }
    ]
  },
  optimizeDeps: {
    entries: ['./src/App.vue']
  }

})