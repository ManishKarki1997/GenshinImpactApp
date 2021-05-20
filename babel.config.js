// module.exports = {
//   presets: ['module:metro-react-native-babel-preset'],
// };

module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['module:metro-react-native-babel-preset'],
    plugins: [
      [
        require.resolve('babel-plugin-module-resolver'),
        {
          root: ['./src/'],
          alias: {
            // define aliases to shorten the import paths
            components: './src/components',
            contexts: './src/contexts',
            assets: './src/assets',
            screens: './src/screens',
          },
          extensions: ['.js', '.jsx', '.tsx', '.ios.js', '.android.js'],
        },
      ],
    ],
  };
};
