module.exports = {
  extends: ['expo', 'prettier'],
  ignorePatterns: ['/dist/*', 'node_modules/*', '.expo/*'],
  rules: {
    'import/no-unresolved': 'off',
  },
};
