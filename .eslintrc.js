// [object Object]
module.exports = {
  extends: 'airbnb',
  rules: {
    'import/no-extraneous-dependencies': 'off',
    'comma-dangle': 'off',
    'func-names': 'off',
    'space-before-function-paren': [2, 'never'],
    eqeqeq: [2, 'allow-null'],
    'no-else-return': 'off',
    'prefer-arrow-callback': ['error', { allowNamedFunctions: true }],
    'no-underscore-dangle': 'off',
    'import/no-unresolved': [
      2,
      {
        ignore: ['url'],
      },
    ],
    'no-return-assign': 'off',
    radix: ['error', 'as-needed'],
    // "header/header": [
    //   2,
    //   "line",
    //   [
    //     {
    //       pattern:
    //         " Copyright 2020 The Bsafebox Authors; licensed to You under the MIT License.",
    //     },
    //   ],
    // ],
  },
  env: {
    node: true,
    jasmine: true,
  },
  plugins: ['header'],
};
