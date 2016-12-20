var keystone = require('keystone');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res);
	var locals = res.locals;

	var eventsCategoryName='events';
	var weeklySeriesCategoryName='weekly-series';
	var newsCategoryName='blog';
	var servicesCategoryName='service'

	var numberOfNews = 3;
	
	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'home';

	locals.data = {
		event: null,
		weeklySeriesEvent: null,
		news: [],
		servicesContent: []
	};

	// Load last event
	view.on('init', function(next) {
		keystone.list('Post').schema.methods.postsForCategory(eventsCategoryName, 'Event', locals.year,  (function(posts, err){
			if(err) next(err);
			if(typeof posts != "undefined"){
				var nextPost = posts[0];
				var today = new Date();
				posts.forEach(function(post) {
					if(post.startDate && post.startDate > today)
					{
						nextPost = post;
					}
				}, this);
				locals.data.event = nextPost;
				next();
			}
		}));
	});

	view.on('init', function(next) {
		keystone.list('Post').schema.methods.postsForCategory(weeklySeriesCategoryName, 'Event', locals.year,  (function(posts, err){
			if(err) next(err);
			if(typeof posts != "undefined"){
				var nextPost = posts[0];
				var today = new Date();
				posts.forEach(function(post) {
					if(post.startDate && post.startDate > today)
					{
						nextPost = post;
					}
				}, this);
				locals.data.weeklySeriesEvent = nextPost;
				next();
			}
				
		}));
	});

	view.on('init', function(next) {
		keystone.list('Post').schema.methods.postsForCategory(newsCategoryName, 'Post', locals.year, (function(posts, err){
			if(err) next(err);
			if(typeof posts != "undefined"){
				locals.data.news = posts.slice(0, numberOfNews);
				next();
			}	
		}));
	});
	//Load services content
	view.on('init', function(next) { 
		keystone.list('Post').schema.methods.postsForCategory(servicesCategoryName, 'Post', null, (function(posts, err){
			if(err) next(err);
			if(typeof posts != "undefined"){
				locals.data.servicesContent = posts;
				next();
			}
				
		}));
	});
	
	// Render the view
	view.render('index');
	
};
