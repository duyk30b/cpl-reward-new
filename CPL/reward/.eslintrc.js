module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/linebreak-style': 0,
    '@typescript-eslint/semi': 'off',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'no-console': 0,

    'padding-line-between-statements': [                                      // quy tắc cách 1 dòng
      1,
      { blankLine: 'always', prev: '*', next: ['class', 'function', 'export'] },
      { blankLine: 'always', prev: ['import'], next: '*' },
      { blankLine: 'never', prev: ['import'], next: ['import'] },
      { blankLine: 'any', prev: ['export'], next: ['export'] },
    ],
    'object-shorthand': [1, 'always'],
    'lines-between-class-members': [1, 'always', { exceptAfterSingleLine: true }], // Dòng trống giữa các properties trong Class
    'spaced-comment': [1, 'always'],
    'no-multiple-empty-lines': [1, { max: 1, maxEOF: 0 }],                    // Số dòng trống tối đa
    'nonblock-statement-body-position': [1, 'beside'],                        // không cho xuống dòng với if else không có {}
    'no-multiple-empty-lines': [1, { max: 1, maxEOF: 0 }],                    // Số dòng trống tối đa
    'prefer-destructuring': [1, { object: true, array: true }],               // Bắt buộc dùng destructuring
  },
}
