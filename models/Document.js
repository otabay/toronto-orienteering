var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Document Model
 * ==================
 */

var Document = new keystone.List('Document', {
	autokey: { from: 'name', path: 'key', unique: true }
});

var s3Storage = new keystone.Storage({
	adapter: require('keystone-storage-adapter-s3'),
	s3: {
		//make sure you have the s3 properties (key, secret, bucket) set in the .env file
		key: process.env.AWS_S3_KEY,
		secret: process.env.AWS_S3_SECRET,
		bucket: process.env.AWS_S3_BUCKET,
		region: process.env.AWS_S3_REGION,

		uploadParams: { // optional; add S3 upload params; see below for details
			ACL: 'public-read',
		}
	},
});
  

Document.add({
	name: { type: String, required: true },
	title: { type: String },
	documentContent: {
		type: Types.File,
		storage:s3Storage,
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
