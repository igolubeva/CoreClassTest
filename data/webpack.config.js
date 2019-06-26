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
				use: ["style-loader", "css-loader", "sass-loader", "postcss-loader",  "resolve-url-loader"]
			},
			{
				test: /\.(woff|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
				loader: 'url-loader?limit=10000&mimetype=application/font-woff&name=asset_[hash].[ext]',
			},
			{
				test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
				loader: 'file-loader?name=asset_[hash].[ext]',
			},
			{ test: /\.png$/, loader: 'file-loader?name=asset_[hash].[ext]' },
			{
				include: /\.json$/,
				loaders: ['json-loader'],
			},
			{
				test: /\.gif$/i,
				use: [
					'file-loader',
					{
						loader: 'image-webpack-loader',
						options: {
							bypassOnDebug: true, // webpack@1.x
							disable: true, // webpack@2.x and newer
						},
					},
				],
			}
		]
	}
};