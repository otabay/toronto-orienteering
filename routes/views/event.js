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
		event: {}
	};
	
	// Load the current post
	view.on('init', function(next) {
		
		var q = keystone.list('Event').model.findOne({
			state: 'published',
			slug: locals.filters.event
		}).populate('author categories location meetDirector courseSetter documents');
		
		q.exec(function(err, doc) {
			keystone.list('Location').model.populate(doc.location, {path:'map'},
                   function(err, result){    
					locals.data.event = doc;
					next(err);
			});
		
		});
	});		
	
	// Render the view
	view.render('event');
	
};
