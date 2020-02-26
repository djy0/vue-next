module.exports = {
  preset: 'ts-jest',
  globals: {
    __FEATURE_OPTIONS__: false
  },
  rootDir: __dirname,
  testMatch: ['<rootDir>/packages/vue/examples/__tests__/*spec.[jt]s?(x)']
}
