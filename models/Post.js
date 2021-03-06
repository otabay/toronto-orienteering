var keystone = require('keystone');
var moment = require('moment');
var Types = keystone.Field.Types;

/**
 * Post Model
 * ==========
 */

var Post = new keystone.List('Post', {
	map: {
		name: 'title'
	},
	autokey: {
		path: 'slug',
		from: 'title',
		unique: true
	}
});

Post.add({
	title: {
		type: String,
		required: true
	},
	friendlyTitle: {
		type: String
	},
	state: {
		type: Types.Select,
		options: 'draft, published, archived',
		default: 'draft',
		index: true
	},
	author: {
		type: Types.Relationship,
		ref: 'User',
		index: true
	},
	publishedDate: {
		type: Types.Date,
		index: true,
		dependsOn: {
			state: 'published'
		}
	},
	image: {
		type: Types.CloudinaryImage
	},
	content: {
		brief: {
			type: Types.Html,
			wysiwyg: true,
			height: 150
		},
		extended: {
			type: Types.Html,
			wysiwyg: true,
			height: 400
		}
	},
	meta: {
		title: {
			type: String
		},
		description: {
			type: String
		}
	},
	categories: {
		type: Types.Relationship,
		ref: 'PostCategory',
		many: true
	},
	order: {
		type: Number
	}
});

Post.schema.virtual('content.full').get(function () {
	return this.content.extended || this.content.brief;
});

Post.schema.virtual('fullPostUrl').get(function () {
	return keystone.get('baseUrl') + 'blog/post/' + this.slug;
});

Post.schema.virtual('fullEventUrl').get(function () {
	return keystone.get('baseUrl') + 'events/event/' + this.slug;
});


Post.schema.methods.postsForCategory = function (categoryKey, type, year, callback) {

	if (type != 'Post' && type != 'Event') {
		console.log("Error - specify Post or Event for the type");
		callback();
	}
	keystone.list('PostCategory').model.findOne({
		key: categoryKey
	}).exec(function (err, category) {

		if (err) return callback(err);
		if (!category) {
			console.log("Could not find category" + categoryKey);
			callback();
		}
		var q = keystone.list(type).model.find()
			.populate('author')
			.populate('location')
			.populate('clinicCoordinator')
			.populate('results')
			.where('categories').in([category.id])
			.where('state', 'published')
		if (type == 'Event') {
			if (year) {
				var fromDate = new Date(year, 0, 0);
				var toDate = new Date(year + 1, 0, 0);
				q.where('startDate').gt(fromDate).lt(toDate);
			}
			q.sort('order -startDate')
		} else if (type == 'Post') {
			q.sort('order -publishedDate');
		}
		q.exec(function (err, posts) {
			if (err) return callback(err);
			if (!posts.length) {
				callback([]);
			} else {
				callback(posts);
			}
		});
	})
};

Post.schema.methods.postYears = function (categoryKey, type, callback) {

	if (type != 'Post' && type != 'Event') {
		console.log("Error - specify Post or Event for the type");
		callback();
	}
	keystone.list('PostCategory').model.findOne({
		key: categoryKey
	}).exec(function (err, category) {

		if (err) return callback(err);
		if (!category) {
			console.log("Could not find category" + categoryKey);
			callback();
		}
		var q = keystone.list(type).model.find()
			.where('categories').in([category.id])
			.where('state', 'published');
		q.exec(function (err, posts) {

			if (err) return callback(err);
			var years = [];
			posts.forEach(function (post) {
				var year = 0
				if (type == 'Post' && post.publishedDate) {
					year = post.publishedDate.getFullYear();
				} else if (type == 'Event' && post.startDate) {
					year = post.startDate.getFullYear();
				}
				if (years.indexOf(year) == -1) {
					years.push(year);
				}
			}, this);
			callback(null, years);
		});
	})
};

Post.schema.methods.loadPost = function (slug, callback) {

	var q = keystone.list('Post').model.findOne({
		state: 'published',
		slug: slug
	});

	q.exec(function (err, result) {
		callback(err, result);
	});
};


Post.defaultColumns = 'title, author|20%, startDate|20%, publishedDate|20%';
Post.register();


var Event = new keystone.List('Event', {
	inherits: Post
});
Event.add({
	startDate: {
		type: Types.Datetime,
		index: true
	},
	endDate: {
		type: Types.Datetime
	},
	registrationTime: {
		type: String
	},
	registrationLink: {
		type: Types.Url
	},
	location: {
		type: Types.Relationship,
		ref: 'Location'
	},
	meetDirector: {
		type: Types.Relationship,
		ref: 'User',
		index: true,
		many: true
	},
	courseSetter: {
		type: Types.Relationship,
		ref: 'User',
		index: true,
		many: true
	},
	format: {
		type: Types.Html,
		wysiwyg: true,
		height: 200
	},
	cost: {
		type: Types.Html,
		wysiwyg: true,
		height: 200
	},
	notes: {
		type: Types.Html,
		wysiwyg: true,
		height: 200
	},
	documents: {
		type: Types.Relationship,
		ref: 'Document',
		many: true
	},
	results: {
		type: Types.Relationship,
		ref: 'Document',
		many: true
	},
	hasClinic: {
		type: Boolean
	},
	clinicType: {
		type: Types.Select,
		options: ['Beginner', 'Advanced']
	},
	clinicCoordinator: {
		type: Types.Relationship,
		ref: 'User'
	},
	subEvents: {
		type: Types.Relationship,
		ref: 'Event',
		many: true
	}
});

Event.schema.methods.eventsWithClinic = function (callback) {

	var q = keystone.list('Event').model.find()
		.populate('location')
		.populate('meetDirector')
		.populate('clinicCoordinator')
		.where('state', 'published')
		.where('hasClinic', true)
		.where('startDate').gt(new Date())
		.sort('order startDate')

	q.exec(function (err, posts) {
		if (err) return callback(err);
		if (!posts.length) {
			callback();
		} else {
			callback(err, posts);
		}
	});
};

Event.schema.virtual('clinicRegistrationUrl').get(function () {
	if (!this.hasClinic) return '';
	if (this.registrationLink) return this.registrationLink;
	var emailSubject = '?subject=' + this.title + ',' + this._.startDate.format('MMM, Do');
	if (this.clinicCoordinator) return 'mailto:' + this.clinicCoordinator.email + emailSubject;
	return 'mailto:info@torontoorienteering.com' + emailSubject;
});

Event.schema.virtual('eventDate').get(function () {

	if (!this.startDate) return '';

	var start = this.startDate.setHours(0, 0, 0, 0);
	var end = this.endDate.setHours(0, 0, 0, 0);
	var dateDiff = (end - start);
	var dateString = this._.startDate.format('MMM Do');

	if (dateDiff > 0) {
		const tempDate = new Date(start + dateDiff);
		if (this.startDate.getMonth() == tempDate.getMonth()) {
			dateString = dateString + " - " + moment(tempDate).format('Do');
		} else {
			dateString = dateString + " - " + moment(tempDate).format('MMM Do');
		}
	}
	return dateString;
});


Event.register();
