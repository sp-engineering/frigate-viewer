module.exports = {
  root: true,
  extends: '@react-native-community',
  overrides: [
    {
      files: ['*'],
      rules: {
        'linebreak-style': 'crlf',
      },
    }
  ],
};
