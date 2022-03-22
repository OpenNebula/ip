import { defineConfig } from 'rollup'
import inject from '@rollup/plugin-inject'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import babel from '@rollup/plugin-babel'

export default defineConfig({
  input: ['wmks.js'],
  output: {
    dir: 'dist',
    format: 'esm',
    sourcemap: true,
  },
  plugins: [
    inject({ jQuery: 'jquery' }),
    resolve(),
    commonjs({ include: 'node_modules/**' }),
    babel({
      extensions: ['.js'],
      exclude: 'node_modules/**',
      babelHelpers: 'runtime',
      minified: true,
      comments: false,
    })
  ],
})