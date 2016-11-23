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
      test: /\.json$/,
      loader: 'ignore-loader'
    },
    {
      test: /\.jsx$/,
      exclude: /(node_modules)/,
      loader: 'babel',
      query: {
        presets: ['react', 'es2015', 'stage-1'],
        plugins: ['transform-decorators-legacy']
      }
    },
    {
      test: /\.js$/,
      exclude: /(node_modules)/,
      loader: 'babel',
      query: {
        presets: ['es2015', 'stage-1'],
        plugins: ['transform-decorators-legacy']
      }
    },
    { 
      test: /\.css$/, 
      loader: "style-loader!css-loader" 
    },
    {
        test: /\.scss$/,
        loaders: ["style", "css", "sass"]
    },    
    { 
      test: /\.png$/, 
      loader: "url-loader?limit=100000" 
    },
    { 
      test: /\.jpg$/, 
      loader: "file-loader" 
    },
    {
      test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/, 
      loader: 'url?limit=10000&mimetype=application/font-woff'
    },
    {
      test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, 
      loader: 'url?limit=10000&mimetype=application/octet-stream'
    },
    {
      test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, 
      loader: 'file'
    },
    {
      test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, 
      loader: 'url?limit=10000&mimetype=image/svg+xml'
    }
      ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  devServer: {
    historyApiFallback: true,
    contentBase: './'
  },
  "plugins": []
}
