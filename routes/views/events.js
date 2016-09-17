var keystone = require('keystone');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;
	
	var eventsCategoryName='events';
	var weeklySeriesCategoryName='wednesday-night';

	locals.section = 'events';
	
	locals.data = {
		events: [],
		weeklySeries: []
	};
	
	// Load events
	view.on('init', function(next) {
		keystone.list('Post').schema.methods.postsForCategory(eventsCategoryName,  (function(posts, err){
			if(err) next(err);
			locals.data.events = posts;
			next();
		}));
	});

	//Load wednesday night series
	view.on('init', function(next) { 
		keystone.list('Post').schema.methods.postsForCategory(weeklySeriesCategoryName,  (function(posts, err){
			if(err) next(err);
			locals.data.weeklySeries = posts;
			next();
		}));
	});

	
	// Render the view
	view.render('events');

};
