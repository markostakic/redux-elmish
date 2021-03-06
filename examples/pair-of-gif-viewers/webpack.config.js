var path = require('path');
var webpack = require('webpack');

module.exports = {
  debug: true,
  target: 'web',
  devtool: 'eval',
  plugins: [
    new webpack.NoErrorsPlugin()
  ],
  entry: [
    'react-hot-loader/patch',
    'babel-polyfill',
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/only-dev-server',
    './src/main.js'
  ],
  output: {
    path: path.join(__dirname, './dev'),
    filename: 'app.bundle.js'
  },
  module: {
    loaders: [{
      test: /\.jsx$|\.js$/,
      loaders: ['babel-loader'],
      include: path.join(__dirname, './src')
    }]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  }
};
