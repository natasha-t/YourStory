const webpack = require('webpack');
const path = require('path');

module.exports = {
	entry: './client/app.js',
	output: {
		path: path.join(__dirname, 'client/app'),
		filename: 'bundle.js'
	}
}