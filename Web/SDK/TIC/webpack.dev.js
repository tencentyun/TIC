const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/TIC.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'TIC.js',
    libraryTarget: 'umd',
    libraryExport: "default",
    library: 'TIC'
  },

  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader'
      }
    }, {
      test: /\.js$/,
      exclude: /node_modules/,
      loader: "eslint-loader",
      options: {}
    }]
  },

  plugins: [
    new CopyWebpackPlugin([{
      from: './dist/TIC.js',
      to: '../demo/libs/'
    }])
  ]
};