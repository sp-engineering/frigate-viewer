module.exports = {
  root: true,
  extends: '@react-native',
  overrides: [
    {
      files: ['*'],
      rules: {
        'linebreak-style': 'crlf',
      },
    }
  ],
};
