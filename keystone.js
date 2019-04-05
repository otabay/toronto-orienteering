// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
require('dotenv').config();

// Require keystone
var keystone = require('keystone');
require('connect-mongo');

// Initialise Keystone with your project's configuration.
// See http://keystonejs.com/guide/config for available options
// and documentation.

keystone.init({

	'name': 'TOC',
	'brand': 'TOC',

	'less': 'public',
	'static': 'public',
	'favicon': 'public/favicon.ico',
	'views': 'templates/views',
	'view engine': 'pug',

	'emails': 'templates/emails',

	'auto update': true,
	'session': true,
	'auth': true,
	'user model': 'User',

	'cloudinary config': process.env.CLOUDINARY_URL,
	'cookie secret': process.env.COOKIE_SECRET || 'demo',
	'session store': 'connect-mongo',
	'mongo': process.env.MONGO_URI || process.env.MONGOLAB_URI || 'mongodb://mongo/toc',

	'wysiwyg override toolbar': false,
	'wysiwyg menubar': true,
	'wysiwyg images': true,
	'wysiwyg skin': 'lightgray',
	'wysiwyg additional buttons': 'searchreplace visualchars,' +
		' charmap ltr rtl pagebreak paste, forecolor backcolor,' +
		' emoticons media, preview',
	'wysiwyg additional plugins': 'table, advlist, anchor,' +
		' autolink, autosave, charmap, contextmenu, ' +
		' directionality, emoticons, hr, media, pagebreak,' +
		' paste, preview, searchreplace, textcolor,' +
		' visualblocks, visualchars, wordcount',

});

// Load your project's Models

keystone.import('models');

// Setup common locals for your templates. The following are required for the
// bundled templates and layouts. Any runtime locals (that should be set uniquely
// for each request) should be added to ./routes/middleware.js

keystone.set('locals', {
	_: require('lodash'),
	env: keystone.get('env'),
	utils: keystone.utils,
	editable: keystone.content.editable
});

// Load your project's Routes

keystone.set('routes', require('./routes'));

// Configure the navigation bar in Keystone's Admin UI

keystone.set('nav', {
	'events': 'events',
	'locations': 'locations',
	'maps': 'maps',
	'documents': 'documents',
	'posts': ['posts', 'post-categories'],
	'enquiries': 'enquiries',
	'users': 'users',
	'configurations': 'configurations',
	'promo-banners': 'promo-banners'
});

keystone.set('baseUrl', (keystone.get('env') == 'production') ? 'http://torontoorienteering.com/' : 'http://localhost:3000/');

keystone.set('googleAnalyticsId', process.env.GOOGLE_ANALYTICS_TRACKING_ID);
keystone.set('s3bucket', process.env.AWS_S3_BUCKET);

// Start Keystone to connect to your database and initialise the web server

keystone.start();
