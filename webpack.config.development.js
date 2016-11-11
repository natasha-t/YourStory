const webpack = require('webpack')
const path = require('path')
const baseConfig = require('./webpack.config.js');

baseConfig.plugins.push(new webpack.DefinePlugin({
  "process.env": {
    NODE_ENV: JSON.stringify("development"),
    HOST: JSON.stringify("http://localhost:3000")
  },
}))

module.exports = baseConfig;