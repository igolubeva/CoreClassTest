var path = require('path');
var ExtractTextPlugin = require ('extract-text-webpack-plugin');

module.exports = {
	entry: './src/main/js/index.js',
	devtool: 'sourcemaps',
	cache: true,
	mode: 'development',
	output: {
		path: __dirname,
		filename: './src/main/resources/static/built/bundle.js'
	},
	plugins: [
		new ExtractTextPlugin('bundle.css'),
	],
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /(node_modules)/,
				use: [{
					loader: 'babel-loader',
					options: {
						presets: ["@babel/preset-env", "@babel/preset-react"]
					}
				}]
			},
			{
				test: /\.(sa|sc|c)ss$/,
				use: ["style-loader", "css-loader", "sass-loader", "postcss-loader"]
			}
		]
	}
};