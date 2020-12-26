// Font imports in "./stylesheets/base/_fonts.sass"

// Styles
import 'normalize.css';
import './stylesheets/main.sass';

// Icons
// import './assets/icons/icon-facebook.svg';
// import './assets/icons/icon-instagram.svg';
// import './assets/icons/icon-twitter.svg';

// // Images
// import './assets/images/img-connect.jpg';
// import './assets/images/img-forest.jpg';
// import './assets/images/img-sea.jpg';

import './scripts/index';

// Only files accepted here will be hot reloaded.
// When making changes in this file be sure to reload the page.
if ( module && module.hot ) {
	module.hot.accept( './scripts/index.js', () => 'Module accepted.' );
}
