module.exports = env => {
	const path = require( 'path' );
	
	// Env
	const isDev = !env.production;
	const isWatching = !!env.watch;
	const isAnalyze = !!env.analyze;
	
	// Constants
	const APP_DIR = './src';
	const BUILD_DIR = 'public';
	const BUILD_ASSETS_DIR = 'static';
	const ENTRY_FILENAME = 'index';
	
	// Filenames
	const assetFilename = isDev ? '[name]' : '[contenthash]';
	
	// Plugins
	const HTMLWebpackPlugin = require( 'html-webpack-plugin' );
	const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );
	const BrowserSyncPlugin = require( 'browser-sync-webpack-plugin' );
	
	const { CleanWebpackPlugin } = require( 'clean-webpack-plugin' );
	const { BundleAnalyzerPlugin } = isAnalyze && require( 'webpack-bundle-analyzer' );
	const { SourceMapDevToolPlugin } = isDev && require( 'webpack' );
	
	const { WebpackManifestPlugin } = !isDev && require( 'webpack-manifest-plugin' );
	const CssMinimizerPlugin = !isDev && require( 'css-minimizer-webpack-plugin' );
	
	// Config
	const mode = isDev ? 'development' : 'production';
	const entryFilename = isDev ? '[name].js' : '[contenthash].js';
	const inlineLimit = isWatching && 1000 * 10;
	
	// Fix for hmr not working properly because of browserslist
	const target = 'web';
	const devtool = false;
	const entry = path.resolve( __dirname, APP_DIR, ENTRY_FILENAME );
	const output = {
		path: path.resolve( __dirname, BUILD_DIR ),
		filename: entryFilename,
		chunkFilename: entryFilename,
		publicPath: ''
	};
	
	const devServer = {
		contentBase: path.join( __dirname, BUILD_DIR ),
		compress: true,
		hot: true,
		watchContentBase: true
	};
	
	const watchOptions = {
		ignored: /node_modules/,
		aggregateTimeout: 0,
		poll: 0
	};
	
	const sourceMap = {
		sourceMap: isDev
	};
	
	const modules = {
		rules: [
			// JS Loader
			{
				test: /\.js$/i,
				exclude: /node_modules/,
				use: 'babel-loader'
			},
			
			// Image optimization & URL Loader
			{
				test: /\.(png|jpe?g|svg)$/i,
				loader: 'image-webpack-loader',
				options: {
					enforce: 'pre',
					bypassOnDebug: true,
					limit: inlineLimit,
				}
			},
			{
				test: /\.(png|jpe?g)$/i,
				loader: 'url-loader',
				options: {
					name: `${ assetFilename }.[ext]`,
					outputPath: 'static/images',
					publicPath: '../images',
					limit: inlineLimit
				}
			},
			{
				test: /\.svg$/i,
				loader: 'url-loader',
				options: {
					name: `${ assetFilename }.[ext]`,
					limit: inlineLimit,
					outputPath: 'static/icons',
					publicPath: '../icons/',
				}
			},
			
			// Fonts Loader
			{
				test: /\.(ttf|woff|woff2|otf)$/i,
				loader: 'url-loader',
				options: {
					name: `${ assetFilename }.[ext]`,
					outputPath: 'static/fonts',
					publicPath: '../fonts/',
					limit: inlineLimit
				}
			},
		
		]
	};
	
	const optimizationOptions = {
		runtimeChunk: 'single',
		splitChunks: {
			chunks: 'all',
			cacheGroups: {
				defaultVendors: {
					// Note the usage of `[\\/]` as a path separator for cross-platform compatibility.
					test: /[\\/]node_modules[\\/]lodash-es[\\/]/,
					filename: isDev ? 'vendor.js' : '[contenthash].js',
					// Tells webpack to ignore splitChunks.minSize, splitChunks.minChunks, splitChunk.
					// maxAsyncRequests and splitChunks.maxInitialRequests options and always create
					// chunks for this cache group.
					enforce: true
				},
				// Imported in main.sass
				normalize: {
					test: /[\\/]node_modules[\\/]normalize.css[\\/]/,
					filename: isDev ? 'vendor.css' : '[contenthash].css',
					enforce: true
				}
			}
		},
		minimize: !isDev,
		minimizer: [ `...` ]
	};
	
	// Loader Rules
	const styleRules = {
		test: /\.scss$/i,
		use: [
			isWatching ? 'style-loader' : MiniCssExtractPlugin.loader,
			{
				loader: 'css-loader',
				options: sourceMap
			}
		]
	};
	
	const optimization = isWatching ? { minimize: false } : optimizationOptions;
	
	const plugins = [
		new CleanWebpackPlugin( {
			verbose: true
		} ),
		new HTMLWebpackPlugin( {
			template: 'src/template.html',
			filename: 'index.html',
			showErrors: isDev,
			minify: !isDev,
			favicon: `${ APP_DIR }/assets/images/favicon.png`,
			scriptLoading: 'defer',
			cache: true
		} ),
		new MiniCssExtractPlugin( {
			filename: `${ BUILD_ASSETS_DIR }/styles/${ assetFilename }.css`
		} ),
		new BrowserSyncPlugin(
			// BrowserSync options
			{
				host: 'localhost',
				port: 8000,
				proxy: 'http://localhost:8080/',
				
				files: [
					'**/template.html', // reload on html change
					{
						match: '**/*.js',
						options: {
							ignored: [ '**/*.js' ] // ignore all js files, hmr will take care of it
						}
					},
					{
						match: '**/*.scss',
						options: {
							ignored: [ '**/*.scss' ] // ignore all sass files, hmr will take care of it
						}
					}
				],
				reloadDelay: 0
			}, { reload: false }
		)
	];
	
	// *******
	// Conditionally inserted
	// Loaders
	// *******
	if ( CssMinimizerPlugin ) {
		// Webpack 5 feature `...` to 'extend' Terser and other minimizers
		optimizationOptions.minimizer.push( `...`, new CssMinimizerPlugin( {
			parallel: true,
			sourceMap: true,
			minimizerOptions: {
				preset: [
					'default',
					{
						discardComments: { removeAll: true }
					}
				]
			}
		} ) );
	}
	
	const additionalStyleLoaders = [
		{
			loader: 'postcss-loader',
			options: {
				sourceMap: isDev,
				postcssOptions: {
					plugins: [
						'autoprefixer',
						'postcss-preset-env'
					]
				}
			}
		},
		{
			loader: 'sass-loader',
			options: sourceMap
		}
	];
	// Add additional loaders to the rules array
	styleRules.use.push( ... additionalStyleLoaders );
	modules.rules.push( styleRules );
	
	// *******
	// Plugins
	if ( WebpackManifestPlugin ) {
		plugins.push( new WebpackManifestPlugin() );
	}
	
	if ( BundleAnalyzerPlugin ) {
		plugins.push( new BundleAnalyzerPlugin() );
	}
	
	if ( SourceMapDevToolPlugin ) {
		plugins.push( new SourceMapDevToolPlugin( {
			filename: 'maps/[contenthash][ext].map',
			exclude: [ 'vendor.js', 'runtime.js' ]
		} ) );
	}
	
	const config = {
		mode,
		target,
		devtool,
		entry,
		output,
		devServer,
		watchOptions,
		module: modules,
		optimization,
		plugins
	};
	
	return config;
};
