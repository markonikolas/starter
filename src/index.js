import './scripts';
import './stylesheets/main.scss';

// Only files accepted here will be hot reloaded.
// When making changes in this file be sure to reload the page.
const acceptModule = () => 'Module accepted.';
const { hot } = module;

if ( module && hot ) {
	hot.accept( './scripts/', acceptModule );
}

// Additional settings for hot module replacement here
// e. g. how DOM handles 'unmounting' nodes
