import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';
import webpack from 'webpack';
import WebpackNodeExternals from 'webpack-node-externals';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import TerserWebpackPlugin from 'terser-webpack-plugin';

const isDev = process.env.NODE_ENV !== 'production';
const commonWebpackConfig: webpack.Configuration = {
	mode: isDev ? 'development' : 'production',
	devtool: isDev ? 'source-map' : undefined,
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'ts-loader',
						options: {
							transpileOnly: true,
						},
					},
					{
						loader: 'babel-loader',
					},
				],
			},
			{
				test: /\.css$/i,
				exclude: /node_modules/,
				use: [MiniCssExtractPlugin.loader, 'css-loader'],
			},
			{
				test: /\.(png|jpe?g|gif)$/i,
				exclude: /node_modules/,
				loader: 'file-loader',
				options: {
					output: 'images',
				},
			},
			{
				test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
				loader: 'file-loader',
				options: {
					output: 'fonts',
				},
			},
		],
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js', '.json'],
		alias: {
			modules: path.resolve(__dirname, 'src', 'modules'),
		},
	},
	stats: 'errors-only',
	plugins: [
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
		}),
		new ForkTsCheckerWebpackPlugin({
			async: false,
			eslint: {
				files: './src/**/*.{ts,tsx,js,jsx}',
			},
		}),
		new MiniCssExtractPlugin(),
	],
	output: {
		path: path.join(__dirname, '..', '.electron'),
		filename: '[name].js',
	},
};

const browserRendererWebpackConfig: webpack.Configuration = {
	...commonWebpackConfig,
	entry: {
		index: path.join(__dirname, '..', 'src', 'index.tsx'),
	},
	plugins: [
		...commonWebpackConfig.plugins,
		new webpack.HotModuleReplacementPlugin(),
		new HtmlWebpackPlugin({
			template: path.join(__dirname, '..', 'src', 'core', 'assets', 'index.html'),
			filename: 'index.html',
		}),
	],
	devServer: {
		contentBase: path.join(__dirname, '..', '.electron'),
		port: 3000,
		compress: true,
		stats: 'errors-only',
		noInfo: true,
	},
	target: 'web',
	optimization: isDev
		? undefined
		: {
				minimize: true,
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				minimizer: [new TerserWebpackPlugin()] as any,
		  },
};

const mainProcessWebpackConfig: webpack.Configuration = {
	...commonWebpackConfig,
	entry: {
		main: path.join(__dirname, '..', 'src', 'main.ts'),
	},
	target: 'node',
	externals: [
		WebpackNodeExternals({
			modulesFromFile: true,
		}),
	],
};

export default [browserRendererWebpackConfig, mainProcessWebpackConfig];
