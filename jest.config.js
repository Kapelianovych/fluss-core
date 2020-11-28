export default {
  // Prevents from transforming tests into CommonJS.
  // TODO: this and test script should be reviewed,
  // when jest's module support will be stable.
  transform: {},
  testEnvironment: 'node',
};
