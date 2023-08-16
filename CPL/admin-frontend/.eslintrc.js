module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/typescript/recommended',
    '@vue/prettier',
    '@vue/prettier/@typescript-eslint',
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    '@typescript-eslint/linebreak-style': 0,
    '@typescript-eslint/semi': 'off',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',

    'padding-line-between-statements': [                                      // quy tắc cách 1 dòng
      1,
      { blankLine: 'always', prev: '*', next: ['class', 'function', 'export'] },
      { blankLine: 'always', prev: ['import'], next: '*' },
      { blankLine: 'never', prev: ['import'], next: ['import'] },
      { blankLine: 'any', prev: ['export'], next: ['export'] },
    ],
    'lines-between-class-members': [1, 'always', { exceptAfterSingleLine: true }], // Dòng trống giữa các properties trong Class
  },
}
