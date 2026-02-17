import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';
import swc from 'unplugin-swc';
import path from 'path';

export default defineConfig(() => ({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/apps/api-e2e',
  plugins: [
    tsconfigPaths({ root: '../../' }),
    swc.vite({
      jsc: {
        parser: {
          syntax: 'typescript',
          decorators: true,
        },
        transform: {
          legacyDecorator: true,
          decoratorMetadata: true,
        },
      },
    }),
  ],
  resolve: {
    alias: {
      '@org/api': path.resolve(__dirname, '../../apps/api/src'),
      '@org/domain': path.resolve(__dirname, '../../packages/domain/src'),
      '@org/shared-utils': path.resolve(
        __dirname,
        '../../packages/shared-utils/src'
      ),
      '@org/ui': path.resolve(__dirname, '../../packages/ui/src'),
    },
  },
  test: {
    name: '@org/api-e2e',
    watch: false,
    globals: true,
    environment: 'node',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
  },
}));
