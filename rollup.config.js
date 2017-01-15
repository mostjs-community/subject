import resolve from 'rollup-plugin-node-resolve';
import ts from 'rollup-plugin-typescript';
import typescript from 'typescript';

export default {
  entry: 'src/index.ts',
  dest: 'dist/most-subject.js',
  sourceMap: true,
  format: 'umd',
  moduleName: 'mostSubject',
  plugins: [
    ts({ typescript }),
    resolve({ module: true, jsnext: true })
  ]
}
