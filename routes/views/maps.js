var keystone = require('keystone');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	var contentSlug='content-maps';

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'maps';

	locals.data = {
		mapsContent: {},
	};


	//load directors content content
	view.on('init', function(next) {
		keystone.list('Post').schema.methods.loadPost(contentSlug, function(err, result){
			locals.data.mapsContent = result;
			next(err);
		});
	});

	// Render the view
	view.render('maps');
};
