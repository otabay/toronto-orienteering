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
		}).populate({
			path: 'location',
			model: 'Location',
			populate: {
				path: 'map',
				model: 'Map'
			}
		}).populate('author categories location meetDirector courseSetter documents');
		
		q.exec(function(err, result) {
			locals.data.event = result;
			next(err);
		});
		
	});	
	
	// Render the view
	view.render('event');
	
};
