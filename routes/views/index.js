var keystone = require('keystone');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res);
	var locals = res.locals;

	var eventsCategoryName='events';
	var weeklySeriesCategoryName='weekly-series';
	var newsCategoryName='blog';
	
	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'home';

	locals.data = {
		event: {},
		weeklySeriesEvent: {},
		news: {}
	};

	// Load last event
	view.on('init', function(next) {
		keystone.list('Post').schema.methods.postsForCategory(eventsCategoryName,  (function(posts, err){
			if(err) next(err);
			locals.data.event = posts[0];
			next();
		}));
	});

	view.on('init', function(next) {
		keystone.list('Post').schema.methods.postsForCategory(weeklySeriesCategoryName,  (function(posts, err){
			if(err) next(err);
			locals.data.weeklySeriesEvent = posts[0];
			next();
		}));
	});

	view.on('init', function(next) {
		keystone.list('Post').schema.methods.postsForCategory(newsCategoryName,  (function(posts, err){
			if(err) next(err);
			locals.data.news = posts[0];
			next();
		}));
	});
	
	// Render the view
	view.render('index');
	
};
