import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import pkg from './package.json';
// import replace from "rollup-plugin-replace";
// import { terser } from "rollup-plugin-terser";
// import globals from "rollup-plugin-node-globals";
import { comboBannerText } from '../../ci/copyright-banner';

const extensions = ['.js', '.ts'];

const basePlugins = [
  json(),
  commonjs(),
  resolve({ extensions: [...extensions, '.json'] }),
  babel({
    exclude: 'node_modules/**',
    extensions,
  }),
];

const external = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
];

const banner = comboBannerText(pkg.name, pkg.version);

export default [
  // Commonjs
  // {
  //   input: 'src/index.ts',
  //   output: {
  //     file: 'lib/index.js',
  //     format: 'cjs',
  //   },
  //   plugins: basePlugins,
  //   external,
  // },
  // build umd
  {
    input: 'src/logger.ts',
    plugins: basePlugins,
    external,
    output: [
      {
        name: 'logger',
        file: 'dist/index.js',
        format: 'umd',
        banner,
      },
    ],
  },
];
