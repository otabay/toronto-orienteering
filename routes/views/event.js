var keystone = require('keystone');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res);
	var locals = res.locals;
	
	// Set locals
	locals.section = 'event';
	locals.filters = {
		event: req.params.event
	};
	locals.data = {
		event: {},
		meta: {}
	};
	
	// Load the current post
	view.on('init', function(next) {
		
		var q = keystone.list('Event').model.findOne({
			state: 'published',
			slug: locals.filters.event
		}).populate('author clinicCoordinator categories location meetDirector courseSetter documents results');
		
		q.exec(function(err, doc) {
			keystone.list('Location').model.populate(doc.location, {path:'map'},
                function(err, result){    
					locals.data.event = doc;
					//setup meta info
					locals.data.meta.fullUrl = doc.fullEventUrl;
					locals.data.meta.publishedDate = doc.publishedDate;
					if(doc.image.exists){
						locals.data.meta.imageUrl = doc.image.url;
					}
					if(doc.meta.exists) {
						locals.data.meta.title = doc.meta.title;
						locals.data.meta.description = doc.meta.description;	
					} else {
						locals.data.meta.title = doc.title;
						locals.data.meta.description = doc.brief;
					}
					next(err);
			});
		
		});
	});		
	
	// Render the view
	view.render('event');
	
};
