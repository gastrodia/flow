const { join } = require('path');
const webpack = require('webpack');
const ExtractText = require('extract-text-webpack-plugin');
const SWPrecache = require('sw-precache-webpack-plugin');
const Clean = require('clean-webpack-plugin');
const Copy = require('copy-webpack-plugin');
const HTML = require('html-webpack-plugin');
const uglify = require('./uglify');

const root = join(__dirname, '..');
var IsomorphicPlugin = require('webpack-isomorphic/plugin');
module.exports = isProd => {
	// base plugins array
	const plugins = [
		new Clean(['dist'], { root }),
		new Copy([{ context: 'src/static/', from: '**/*.*' }]),
	//	new webpack.optimize.CommonsChunkPlugin({ name: 'vendor' }),
		new HTML({ template: 'src/index.html' }),
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify(isProd ? 'production' : 'development')
		}),
		new IsomorphicPlugin({
			extensions: ['jpg', 'png', 'gif', 'css','less']
		}),
		new ExtractText('css/[name].[contenthash:6].css')
	];

	if (isProd) {
		plugins.push(
			new webpack.LoaderOptionsPlugin({ minimize:true }),
			new webpack.optimize.UglifyJsPlugin(uglify),
	
			new SWPrecache({
				filename: 'service-worker.js',
				dontCacheBustUrlsMatching: /./,
				navigateFallback: 'index.html',
				staticFileGlobsIgnorePatterns: [/\.map$/]
			})
		);
	} else {
		// dev only
		plugins.push(
			new webpack.HotModuleReplacementPlugin(),
			new webpack.NamedModulesPlugin()
		);
	}

	return plugins;
};
