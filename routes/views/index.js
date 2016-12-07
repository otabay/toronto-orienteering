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

	locals.formData = req.body || {};
	locals.validationErrors = {};
	locals.enquirySubmitted = false;

	// Load last event
	view.on('init', function(next) {
		keystone.list('Post').schema.methods.postsForCategory(eventsCategoryName, 'Event', locals.year,  (function(posts, err){
			if(err) next(err);
			if(typeof posts != "undefined")
				locals.data.event = posts[0];
			next();
		}));
	});

	view.on('init', function(next) {
		keystone.list('Post').schema.methods.postsForCategory(weeklySeriesCategoryName, 'Event', locals.year,  (function(posts, err){
			if(err) next(err);
			if(typeof posts != "undefined")
				locals.data.weeklySeriesEvent = posts[0];
			next();
		}));
	});

	view.on('init', function(next) {
		keystone.list('Post').schema.methods.postsForCategory(newsCategoryName, 'Post', locals.year, (function(posts, err){
			if(err) next(err);
			if(typeof posts != "undefined")
				locals.data.news = posts[0];
			next();
		}));
	});
	//Load services content
	view.on('init', function(next) { 
		keystone.list('Post').schema.methods.postsForCategory(servicesCategoryName, 'Post', null, (function(posts, err){
			if(err) next(err);
			if(typeof posts != "undefined")
				locals.data.servicesContent = posts;
			next();
		}));
	});

	// On POST requests, add the Enquiry item to the database
	view.on('post', { action: 'contact' }, function(next) {
		
		var newEnquiry = new Enquiry.model(),
			updater = newEnquiry.getUpdateHandler(req);
		
		updater.process(req.body, {
			flashErrors: true,
			fields: 'name, email, phone, enquiryType, message',
			errorMessage: 'There was a problem submitting your enquiry:'
		}, function(err) {
			if (err) {
				locals.validationErrors = err.errors;
			} else {
				locals.enquirySubmitted = true;
			}
			next();
		});
		
	});
	
	// Render the view
	view.render('index');
	
};
