const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: path.join(__dirname, 'client/app/app.js'),
  output: {
    path: path.join(__dirname, 'client/public'),
    filename: 'bundle.js',
  },
};
