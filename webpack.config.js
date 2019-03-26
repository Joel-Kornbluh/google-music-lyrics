
const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const rootDir = __dirname;
const srcDir = path.join(rootDir, 'src');
const distDir = path.join(rootDir, 'dist');

module.exports = {
	amd: { jQuery: true },
	bail: true,
	mode: 'production',
	entry: path.join(srcDir, 'content-script.js'),

	resolve: {
		modules: [path.join(rootDir, 'node_modules'), srcDir],
		alias: {
			jquery$: 'jquery/dist/jquery.slim.min.js'
		},
	},

	output: {
		path: distDir,
		filename: 'content-script.js',
	},

	module: {
		rules: [
			// {
			// 	test: /\.html$/,
			// 	use: [
			// 		{
			// 			loader: 'html-loader',
			// 			options: {
			// 				root: srcDir,
			// 				attrs: [
			// 					'img:src'
			// 				],
			// 			},
			// 		},
			// 	],
			// },
			{
				test: [
					{
						test: /\.js$/,
						exclude: /node_modules/,
					},
				],
				use: [
					
				],
			}
		],
	},

	devtool: 'source-maps',

	plugins: [

		// copy over following files
		new CopyWebpackPlugin([
			path.join(srcDir, 'manifest.json'),

		]),

		// removes default webpack closure wrappers around each module
		new webpack.optimize.ModuleConcatenationPlugin()
	],

	optimization: {
		minimize: true
	},

	stats: {
		assets: false,
		chunks: true,
		chunkModules: false,
		modules: false
	}
};
