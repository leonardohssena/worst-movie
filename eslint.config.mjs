import globals from 'globals'
import pluginJs from '@eslint/js'
import prettier from 'eslint-plugin-prettier/recommended'
import tseslint from 'typescript-eslint'

export default [
  {
    files: ['src/**'],
    ignores: [
      '.commitlintrc*',
      '.docker',
      '.eslintcache',
      '.eslintrc*',
      '.prettierrc*',
      'coverage',
      'dist',
      'jest.config.js',
      'logs',
      'node_modules',
      'package-lock.json',
      'yarn.lock',
    ],
  },
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      'sort-imports': [
        'warn',
        {
          allowSeparatedGroups: true,
        },
      ],
    },
  },
  prettier,
]
