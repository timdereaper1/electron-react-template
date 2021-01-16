const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
	target: 'node',
	entry: './src/main.ts',
	mode: process.env.NODE_ENV || 'production',
	output: {
		filename: 'electron.js',
		path: path.join(__dirname, './build'),
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				loader: 'ts-loader',
				exclude: /node_modules/,
				options: {
					configFile: 'tsconfig.electron.json',
					transpileOnly: true,
				},
			},
		],
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js'],
	},
	externals: [nodeExternals()],
};
