var keystone = require('keystone');
var async = require('async');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Init locals
	locals.section = 'events';
	locals.filters = {
		category: req.params.category
	};
	locals.data = {
		posts: [],
		categories: []
	};

	// Load the current category filter
	view.on('init', function(next) {

		var l_category = 'Events';
		if (req.params.category) {
			l_category = locals.filters.category;
		}
		keystone.list('PostCategory').model.findOne({ key: l_category }).exec(function(err, result) {
			locals.data.category = result;
			next(err);
		});

	});

	// Load the posts
	view.on('init', function(next) {

		var q = keystone.list('Post')
			.where('state', 'published')
			.sort('-publishedDate')
			.populate('author categories');

		if (locals.data.category) {
			q.where('categories').in([locals.data.category]);
		}

		q.exec(function(err, results) {
			locals.data.posts = results;
			next(err);
		});

	});

	// Render the view
	view.render('events');

};
