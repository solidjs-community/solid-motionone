import { defineConfig } from 'vitest/config'
import solid from 'vite-plugin-solid'

export default defineConfig({
  plugins: [solid()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./test/setup.ts'],
    include: ['test/**/*.{test,spec}.{js,ts,jsx,tsx}'],
    exclude: ['test/ssr.test.{js,ts,jsx,tsx}'],
  },
  resolve: {
    conditions: ['browser', 'development'],
  },
})
