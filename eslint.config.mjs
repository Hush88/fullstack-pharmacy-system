import jsxParser from '@babel/eslint-parser';
import reactPlugin from 'eslint-plugin-react';

export default [
  {
    files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
    ignores: ['node_modules/**', 'build/**'],
    languageOptions: {
      parser: jsxParser,
      parserOptions: {
        requireConfigFile: false,
        ecmaVersion: 2021,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      react: reactPlugin,
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'no-unused-vars': 'warn',
      'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
      'no-unused-vars': 'off',
      'no-console': 'off',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
];
