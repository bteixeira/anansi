const path = require('path');

module.exports = {
	mode: 'none',
	entry: './src/assets/ts/index.ts',
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				loader: 'awesome-typescript-loader',
				options: {
					configFileName: 'src/assets/tsconfig.json',
				},
			},
			{
				enforce: 'pre',
				test: /\.js$/,
				loader: 'source-map-loader',
			},
		],
	},
	resolve: {
		extensions: ['.ts', '.tsx', '.js'],
	},
	output: {
		path: path.resolve(__dirname, 'public/assets'),
		filename: 'bundle.js',
	},
	devtool: 'source-map',
}
