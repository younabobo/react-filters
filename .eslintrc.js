module.exports = {
  env: {
    browser: true,
    es6: true,
    // "jest/globals": true
  },
  extends: [
    'plugin:react/all',
    'airbnb',
    "plugin:jest/all",
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: [
    'react', 'jest'
  ],
  rules: {
    "linebreak-style": 0
  },
};
