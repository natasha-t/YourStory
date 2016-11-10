const webpack = require('webpack')
const path = require('path')

module.exports = {
  entry: path.join(__dirname, 'client/app/index.jsx'),
  output: {
    path: path.join(__dirname, 'client/public'),
    filename: 'bundle.js'
  },
  module: {
    loaders: [{
      exclude: /node_modules/,
      loader: 'babel',
      query: {
        presets: ['react', 'es2015', 'stage-1'],
        plugins: ['transform-decorators-legacy']
      }
    }]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  devServer: {
    historyApiFallback: true,
    contentBase: './'
  }
}
