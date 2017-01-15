module.exports = {
  tsc: {
    es2015: true,
    patterns: [ 'src/**/*.ts', '!src/**/*.test.ts'],
  },

  tslint: {
    patterns: [ 'src/**/*.test.ts' ],
  },
};
