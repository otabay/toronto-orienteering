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
	title: { type: String },
	documentContent: { 
		type: Types.S3File,
		filename: function(item, filename){
		// prefix file name with object id
		return item.key + '-' + filename; 
		}
	}
});

Document.schema.virtual('fullDocUrl').get(function() {
    return 'https://s3.amazonaws.com/' + keystone.get('s3bucket') + '/' + this.documentContent.filename;
});

Document.register();
