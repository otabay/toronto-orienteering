var keystone = require('keystone');
var async = require('async');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;
	var eventsCategory='events';
	var weeklySeries='wednesday-night';

	// Init locals
	locals.section = 'events';
	locals.filters = {
		category: req.params.category
	};
	locals.data = {
		events: [],
		weeklyEvents: [],
		categories: []
	};

	function findCategory(categoryName) {
		var l_categoryName = categoryName;
		var l_category = null;
		if (req.params.category) {
			l_categoryName = locals.filters.category;
		};
		keystone.list('PostCategory').model.findOne({ key: l_categoryName }).exec(function(err, result) {
			l_category = result;
		});
		return l_category;
	};

	function findCategoryPosts(categoryName){
		var categoryPosts = [];
		var q = keystone.list('Post').paginate({
				page: req.query.page || 1,
				perPage: 10,
				maxPages: 10
			})
			.where('state', 'published')
			.sort('-publishedDate')
			.populate('author categories');

		if (locals.data.category) {
			q.where('categories').in([locals.data.eventsCategory]);
		}

		q.exec(function(err, results) {
			categoryPosts = results;
		});
		return categoryPosts;
	};

	// Load the current category filter
	view.on('init', function(next) {
		locals.data.eventsCategory = findCategory(eventsCategory);
		locals.data.events = findCategoryPosts(locals.data.eventsCategory);
		next();

	});

	// Load the posts
	view.on('init', function(next) {



	});

	// Render the view
	view.render('events');

};
