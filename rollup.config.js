import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import json from "@rollup/plugin-json";

// `npm run build` -> `production` is true
// `npm run dev` -> `production` is false
const production = !process.env.ROLLUP_WATCH;

export default {
	input: 'dist/main.js',
	output: {
		file: 'dist/app.js',
		format: 'es',
		sourcemap: false,
		inlineDynamicImports: true,
	},
	plugins: [
		resolve(), // tells Rollup how to find date-fns in node_modules
		commonjs(), // converts date-fns to ES modules
		json(),
		production && terser() // minify, but only in production
	]
};
