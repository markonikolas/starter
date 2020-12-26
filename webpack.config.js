const Encore = require( '@symfony/webpack-encore' );// eslint-disable-line import/no-extraneous-dependencies

Encore
	.setOutputPath( 'public/' )

	.setPublicPath( '/' )

	.addEntry( 'app', './src/index.js' )

	.splitEntryChunks()

	.enableSingleRuntimeChunk()

/*
     * FEATURE CONFIG
     *
     * Enable & configure other features below. For a full
     * list of features, see:
     * https://symfony.com/doc/current/frontend.html#adding-more-features
     */

	.enableSassLoader()

	.cleanupOutputBeforeBuild()

	.enableSourceMaps( !Encore.isProduction() )

	.enableVersioning( Encore.isProduction() )

	.enableSassLoader()

	.enableIntegrityHashes( Encore.isProduction() );

const config = Encore.getWebpackConfig();

module.exports = config;
