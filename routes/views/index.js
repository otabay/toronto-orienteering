var keystone = require('keystone');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res);
	var locals = res.locals;

	var eventsCategoryName='events';
	var weeklySeriesCategoryName='weekly-series';
	var newsCategoryName='blog';
	var servicesCategoryName='service'
	
	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'home';

	locals.data = {
		event: null,
		weeklySeriesEvent: null,
		news: null,
		servicesContent: []
	};

	// Load last event
	view.on('init', function(next) {
		keystone.list('Post').schema.methods.postsForCategory(eventsCategoryName, 'Event',  (function(posts, err){
			if(err) next(err);
			if(typeof posts != "undefined")
				locals.data.event = posts[0];
			next();
		}));
	});

	view.on('init', function(next) {
		keystone.list('Post').schema.methods.postsForCategory(weeklySeriesCategoryName, 'Event', (function(posts, err){
			if(err) next(err);
			if(typeof posts != "undefined")
				locals.data.weeklySeriesEvent = posts[0];
			next();
		}));
	});

	view.on('init', function(next) {
		keystone.list('Post').schema.methods.postsForCategory(newsCategoryName, 'Post',  (function(posts, err){
			if(err) next(err);
			if(typeof posts != "undefined")
				locals.data.news = posts[0];
			next();
		}));
	});
	//Load services content
	view.on('init', function(next) { 
		keystone.list('Post').schema.methods.postsForCategory(servicesCategoryName, 'Post',  (function(posts, err){
			if(err) next(err);
			if(typeof posts != "undefined")
				locals.data.servicesContent = posts;
			next();
		}));
	});
	
	// Render the view
	view.render('index');
	
};
