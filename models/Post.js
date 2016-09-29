var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Post Model
 * ==========
 */

var Post = new keystone.List('Post', {
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true }
});

Post.add({
	title: { type: String, required: true },
	state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
	author: { type: Types.Relationship, ref: 'User', index: true },
	publishedDate: { type: Types.Date, index: true, dependsOn: { state: 'published' } },
	image: { type: Types.CloudinaryImage },
	content: {
		brief: { type: Types.Html, wysiwyg: true, height: 150 },
		extended: { type: Types.Html, wysiwyg: true, height: 400 }
	},
	categories: { type: Types.Relationship, ref: 'PostCategory', many: true }
});

Post.schema.virtual('content.full').get(function() {
	return this.content.extended || this.content.brief;
});

Post.schema.methods.postsForCategory = function(categoryKey, type, callback){

	if(type != 'Post' && type != 'Event'){
		console.log("Error - specify Post or Event for the type");
		callback();
	}
	keystone.list('PostCategory').model.findOne({key:categoryKey}).exec(function(err,category){

		if(err) return callback(err);
		if(!category) {
			console.log("Could not find category");
			callback();
		}
		keystone.list(type).model.find()
		.populate('author')
		.populate('location')
		.populate('coordinator')
		.where('categories').in([category.id])
		.where('state', 'published')
		.exec(function(err, posts) {
			if (err) return callback(err);
			if (!posts.length) {
				callback();
			} else {
			 	callback(posts);
			}
		});
	})
	
	
};

Post.defaultColumns = 'title, state|20%, author|20%, publishedDate|20%';
Post.register();


var Event = new keystone.List('Event', { inherits: Post });
Event.add({
	startDate: { type: Types.Datetime, index: true },
	endDate: { type: Types.Datetime},
	location: {type: Types.Relationship, ref: 'Location'},
	coordinator: { type: Types.Relationship, ref: 'User', index: true },
	notes: { type: Types.Html, wysiwyg: true, height: 200 }

});

Event.register();
