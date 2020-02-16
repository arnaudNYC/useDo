import babel from 'rollup-plugin-babel'
// import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'

export default {
  input: 'src/useDo.js',
  output: {
    file: 'dist/bundle.js',
    format: 'cjs',
  },
  external: ['react'],
  plugins: [
    babel({
      exclude: 'node_modules/**',
    }),
    commonjs(),
  ],
}
