module.exports = {
  arrowParens: 'avoid',
  bracketSpacing: true,
  endOfLine: 'lf',
  overrides: [
    {
      files: '*.ts',
      options: { parser: 'typescript' },
    },
  ],
  printWidth: 120,
  quoteProps: 'as-needed',
  semi: false,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'all',
  useTabs: false,
}
