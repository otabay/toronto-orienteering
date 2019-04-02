var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Location Model
 * ==================
 */

var PromoBanner = new keystone.List('PromoBanner', {
	autokey: {
		from: 'name',
		path: 'key',
		unique: true
	}
});

PromoBanner.add({
	name: {
		type: String,
		required: true
	},
	enabled: {
		type: Types.Boolean
	},
	image_small_screen: {
		type: Types.CloudinaryImage
	},
	image_large_screen: {
		type: Types.CloudinaryImage
	},
	snippet: {
		type: Types.Html,
		wysiwyg: true,
		height: 400
	}
});


PromoBanner.register();
