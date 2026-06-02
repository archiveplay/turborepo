module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'subject-case': [2, 'always', 'lower-case'],
    'type-enum': [
      2,
      'always',
      [
        'config',
        'feat',
        'fix',
        'chore',
        'docs',
        'refactor',
        'test',
        'perf',
        'ci',
        'build',
        'revert',
      ],
    ],
  },
};
