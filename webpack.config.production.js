const webpack = require('webpack')
const path = require('path')
const baseConfig = require('./webpack.config.js');

baseConfig.plugins.push(new webpack.DefinePlugin({
  "process.env": {
    NODE_ENV: JSON.stringify("production"),
    HOST: JSON.stringify("http://yourstory-app.herokuapp.com")
  }
}))

module.exports = baseConfig;