var keystone = require('keystone');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	var eventsCategoryName = 'events';
	var weeklySeriesCategoryName = 'weekly-series';
	var eventsContentSlug = 'content-events'
	var weeklySeriesSlug = 'content-weekly-series'

	locals.section = 'events';

	locals.year = req.params.year ? parseInt(req.params.year) : locals.defaultYear;

	locals.data = {
		eventsPast: [],
		eventsFuture: [],
		weeklySeriesPast: [],
		weeklySeriesFuture: [],
		eventsContent: {},
		weeklySeriesContent: {},
		eventYears: [],
		weeklySeriesYears: []
	};

	// Load events
	view.on('init', function (next) {
		keystone.list('Post').schema.methods.postsForCategory(eventsCategoryName, 'Event', locals.year, (function (posts, err) {
			if (err) next(err);
			if (typeof posts != "undefined")
				var today = new Date();
			posts.forEach(function (post) {
				if (post.startDate && post.startDate > today || post.endDate && post.endDate > today) {
					locals.data.eventsFuture.push(post);
				} else {
					locals.data.eventsPast.push(post);
				}
			}, this);
			locals.data.eventsFuture.reverse();
			next();
		}));
	});

	//Load wednesday night series
	view.on('init', function (next) {
		keystone.list('Post').schema.methods.postsForCategory(weeklySeriesCategoryName, 'Event', locals.year, (function (posts, err) {
			if (err) next(err);
			if (typeof posts != "undefined")
				var today = new Date();
			posts.forEach(function (post) {
				if (post.startDate && post.startDate > today || post.endDate && post.endDate > today) {
					locals.data.weeklySeriesFuture.push(post);
				} else {
					locals.data.weeklySeriesPast.push(post);
				}
			}, this);
			locals.data.weeklySeriesFuture.reverse();
			next();
		}));
	});

	//load events content
	view.on('init', function (next) {
		keystone.list('Post').schema.methods.loadPost(eventsContentSlug, function (err, result) {
			locals.data.eventsContent = result;
			next(err);
		});
	});

	//load weekly series content
	view.on('init', function (next) {
		keystone.list('Post').schema.methods.loadPost(weeklySeriesSlug, function (err, result) {
			locals.data.weeklySeriesContent = result;
			next(err);
		});
	});

	//get event years
	view.on('init', function (next) {
		keystone.list('Post').schema.methods.postYears(eventsCategoryName, 'Event', function (err, result) {
			locals.data.eventYears = result;
			next(err);
		});
	});

	//get event years
	view.on('init', function (next) {
		keystone.list('Post').schema.methods.postYears(weeklySeriesCategoryName, 'Event', function (err, result) {
			locals.data.weeklySeriesYears = result;
			next(err);
		});
	});


	// Render the view
	view.render('events');

};
