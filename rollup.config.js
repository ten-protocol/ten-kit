import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import dts from 'rollup-plugin-dts';
import alias from '@rollup/plugin-alias';
import path from 'path';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packageJson = JSON.parse(readFileSync('./package.json', 'utf8'));

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: packageJson.main,
        format: 'cjs',
        sourcemap: true,
        inlineDynamicImports: true,
      },
      {
        file: packageJson.module,
        format: 'esm',
        sourcemap: true,
        inlineDynamicImports: true,
      },
    ],
    plugins: [
      peerDepsExternal(),
      alias({
        entries: [
          { find: '@', replacement: path.resolve(__dirname, 'src') }
        ]
      }),
      resolve({
        browser: true,
      }),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
        exclude: ['**/*.stories.*', '**/*.test.*'],
      }),
      postcss({
        extract: true,
        minimize: true,
      }),
    ],
    onwarn(warning, warn) {
      // Suppress warnings from external packages (node_modules) only
      if (warning.id && warning.id.includes('node_modules')) {
        return;
      }
      // Suppress "use client" directives from external packages
      if (warning.code === 'MODULE_LEVEL_DIRECTIVE' && warning.id && warning.id.includes('node_modules')) {
        return;
      }
      // Suppress circular dependencies from external packages
      if (warning.code === 'CIRCULAR_DEPENDENCY' && warning.message && warning.message.includes('node_modules')) {
        return;
      }
      // Suppress "this" rewritten warnings from external packages
      if (warning.code === 'THIS_IS_UNDEFINED' && warning.id && warning.id.includes('node_modules')) {
        return;
      }
      // Show all other warnings (from our source code)
      warn(warning);
    },
    external: ['react', 'react-dom', 'react/jsx-runtime', 'wagmi', 'viem', '@tanstack/react-query', '@tanstack/query-core', 'zustand'],
  },
  {
    input: 'dist/index.d.ts',
    output: [{ file: 'dist/index.d.ts', format: 'esm' }],
    plugins: [
      alias({
        entries: [
          { find: '@', replacement: path.resolve(__dirname, 'dist') }
        ]
      }),
      dts()
    ],
    external: [/\.css$/],
  },
];
