var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Location Model
 * ==================
 */

var Location = new keystone.List('Location', {
	autokey: { from: 'name', path: 'key', unique: true }
});

Location.add({
	name: { type: String, required: true },
	intersection: { type: String },
	directions: { type: Types.Html, wysiwyg: true, height: 200 },
	mapUrl: { type: Types.Url},
	mapEmbed: { type: String }
});


Location.register();
