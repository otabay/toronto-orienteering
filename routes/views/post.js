var keystone = require('keystone');
var _ = require('lodash');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res);
	var locals = res.locals;
	
	// Set locals
	locals.section = 'blog';
	locals.filters = {
		post: req.params.post
	};
	locals.data = {
		post: {},
		meta: {}
	};
	
	// Load the current post
	view.on('init', function(next) {
		
		var q = keystone.list('Post').model.findOne({
			state: 'published',
			slug: locals.filters.post
		}).populate('author categories');
		
		q.exec(function(err, result) {
			locals.data.post = result;
			//populate meta data
			locals.data.meta.fullUrl = result.fullPostUrl;
			locals.data.meta.publishedDate = result.publishedDate;
			if(result.image.exists){
				locals.data.meta.imageUrl = result.image.url;
			}
			if(result.meta.exists) {
				locals.data.meta.title = result.meta.title;
				locals.data.meta.description = result.meta.description;
			} else {
				locals.data.meta.title = result.title;
				locals.data.meta.description = result.brief;
			}
			next(err);
		});
		
	});
	
	// Render the view
	view.render('post');
	
};
