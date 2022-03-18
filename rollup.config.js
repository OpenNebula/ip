import { defineConfig } from 'rollup'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import babel from '@rollup/plugin-babel'

export default defineConfig({
  input: ['wmks.js'],
  external: ['jquery', 'jquery-ui'],
  output: {
    dir: 'dist',
    format: 'esm',
    sourcemap: true,
  },
  plugins: [
    resolve(),
    commonjs({
      include: 'node_modules/**',
    }),
    babel({
      extensions: ['.js'],
      exclude: 'node_modules/**',
      babelHelpers: 'runtime',
    })
  ],
})