var keystone = require('keystone');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;
	
	var eventsCategoryName='events';
	var weeklySeriesCategoryName='weekly-series';
	var eventsContentSlug='content-events'
	var weeklySeriesSlug='content-weekly-series'

	locals.section = 'events';
	
	locals.year = req.params.year?req.params.year:locals.defaultYear;

	locals.data = {
		events: [],
		weeklySeries: [],
		eventsContent: {},
		weeklySeriesContent: {},
		eventYears:[],
		weeklySeriesYears:[]
	};
	
	// Load events
	view.on('init', function(next) {
		keystone.list('Post').schema.methods.postsForCategory(eventsCategoryName, 'Event', locals.year, (function(posts, err){
			if(err) next(err);
			if(typeof posts != "undefined")
				locals.data.events = posts;
			next();
		}));
	});

	//Load wednesday night series
	view.on('init', function(next) { 
		keystone.list('Post').schema.methods.postsForCategory(weeklySeriesCategoryName, 'Event', locals.year, (function(posts, err){
			if(err) next(err);
			if(typeof posts != "undefined")
				locals.data.weeklySeries = posts;
			next();
		}));
	});

	//load events content
	view.on('init', function(next) {
		keystone.list('Post').schema.methods.loadPost(eventsContentSlug, function(err, result){
			locals.data.eventsContent = result;
			next(err);
		});
	});

	//load weekly series content
	view.on('init', function(next) {
		keystone.list('Post').schema.methods.loadPost(weeklySeriesSlug, function(err, result){
			locals.data.weeklySeriesContent = result;
			next(err);
		});
	});

	//get event years
	view.on('init', function(next) {
		keystone.list('Post').schema.methods.postYears(eventsCategoryName, 'Event', function(err, result){
			locals.data.eventYears = result;
			next(err);
		});
	});

	//get event years
	view.on('init', function(next) {
		keystone.list('Post').schema.methods.postYears(weeklySeriesCategoryName, 'Event', function(err, result){
			locals.data.weeklySeriesYears = result;
			next(err);
		});
	});

	
	// Render the view
	view.render('events');

};
