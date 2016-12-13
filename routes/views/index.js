var keystone = require('keystone');
var request =  require('request');

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

	view.on('post', { action: 'subscribe' }, function(next) {
		
		var email = req.body.email;
		request.post({url:'http://link.whc.ca/oi/443/277481752927e3ac0bb55efd1ff07dca', form:{email:email, goto:'', iehack:'&#9760;'}}, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				 res.send("success");
			} else {
				 res.send("error");
			}
		});
		
		
	});
	
	// Render the view
	view.render('index');
	
};
