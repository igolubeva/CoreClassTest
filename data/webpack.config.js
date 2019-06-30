var path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

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
        new MiniCssExtractPlugin({
          filename: './src/main/resources/static/bundle.css',
        }),
      ],
	module: {
		rules: [
		    {
                enforce: "pre",
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "eslint-loader"
              },
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
				use: [
				{ loader: MiniCssExtractPlugin.loader,
				options: {
                              hmr: process.env.NODE_ENV === 'development',
                            },
				},
                 "css-loader", "sass-loader", "postcss-loader",  "resolve-url-loader"]
			},
			{
				test: /\.(woff|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
				loader: 'url-loader?limit=10000&mimetype=application/font-woff&name=./assets/asset_[hash].[ext]',
			},
			{
				test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
				loader: 'file-loader?name=./assets/asset_[hash].[ext]',
			},
			{ test: /\.png$/, loader: 'file-loader?name=./assets/asset_[hash].[ext]' },
			{
				include: /\.json$/,
				loaders: ['json-loader'],
			},
			{
				test: /\.gif$/i,
				use: [
					'file-loader?name=./assets/asset_[hash].[ext]',
					{
						loader: 'image-webpack-loader?name=./assets/asset_[hash].[ext]',
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