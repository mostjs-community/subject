import babel from 'rollup-plugin-babel'

export default {
  entry: 'src/index.js',
  format: 'umd',
  plugins: [
    babel()
  ],
  sourceMap: true,
  globals: {
    'most': 'most',
    'most/lib/scheduler/defaultScheduler': 'most.defaultScheduler',
    '@most/multicast': 'mostMulticast',
    '@most/prelude': 'mostPrelude'
  },
  moduleName: 'mostSubject',
  dest: 'dist/most-subject.js'
}
