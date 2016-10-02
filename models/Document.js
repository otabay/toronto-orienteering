var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Document Model
 * ==================
 */

var Document = new keystone.List('Document', {
	autokey: { from: 'name', path: 'key', unique: true }
});

Document.add({
	name: { type: String, required: true },
	documentContent: { type: Types.S3File }
});


Document.register();
