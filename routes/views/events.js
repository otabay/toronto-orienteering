var keystone = require('keystone');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;
	
	var eventsCategoryName='events';
	var weeklySeriesCategoryName='weekly-series';
	var eventsContentSlug='content-events'
	var weeklySeriesSlug='content-weekly-series'

	locals.section = 'events';
	
	locals.data = {
		events: [],
		weeklySeries: [],
		eventsContent: null,
		weeklySeriesContent: null
	};
	
	// Load events
	view.on('init', function(next) {
		keystone.list('Post').schema.methods.postsForCategory(eventsCategoryName, 'Event', (function(posts, err){
			if(err) next(err);
			if(typeof posts != "undefined")
				locals.data.events = posts;
			next();
		}));
	});

	//Load wednesday night series
	view.on('init', function(next) { 
		keystone.list('Post').schema.methods.postsForCategory(weeklySeriesCategoryName, 'Event',  (function(posts, err){
			if(err) next(err);
			if(typeof posts != "undefined")
				locals.data.weeklySeries = posts;
			next();
		}));
	});

	//load events content
	view.on('init', function(next) {
		
		var q = keystone.list('Post').model.findOne({
			state: 'published',
			slug: eventsContentSlug
		});
		
		q.exec(function(err, result) {
			locals.data.eventsContent = result;
			next(err);
		});
		
	});

	//load weekly series content
	view.on('init', function(next) {
		
		var q = keystone.list('Post').model.findOne({
			state: 'published',
			slug: weeklySeriesSlug
		});
		
		q.exec(function(err, result) {
			locals.data.weeklySeriesContent = result;
			next(err);
		});
		
	});

	
	// Render the view
	view.render('events');

};
