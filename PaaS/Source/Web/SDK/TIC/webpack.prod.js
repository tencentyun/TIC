const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './src/TIC.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'TIC.min.js',
    libraryTarget: 'umd',
    libraryExport: "default",
    library: 'TIC'
  },

  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: "babel-loader"
    }, {
      test: /\.js$/,
      exclude: /node_modules/,
      loader: "eslint-loader",
      options: {}
    }]
  },

  plugins: [
    new UglifyJSPlugin({
      uglifyOptions: {
        compress: {
          drop_console: true
        }
      }
    })
  ]
};