const path = require('path');
const webpack = require('webpack');

module.exports = {
  debug: true,
  devtool: "#eval-source-map",
  entry: './src/index',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
      },
    }),
  ],
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['babel'],
      exclude: /node_modules/,
    }, {
      test: /\.css$/,
      loaders: ['style', 'css'],
      exclude: /node_modules/,
    }, {
      test: /\.(eot|woff|ttf|woff2|svg)$/,
      loaders: ['file'],
      exclude: /node_modules/,
    }],
  },
};
