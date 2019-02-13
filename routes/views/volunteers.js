var keystone = require('keystone');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	var contentSlug='content-volunteers';

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'volunteers';

	locals.data = {
		volunteersContent: {},
	};


	//load directors content content
	view.on('init', function(next) {
		keystone.list('Post').schema.methods.loadPost(contentSlug, function(err, result){
			locals.data.volunteersContent = result;
			next(err);
		});
	});

	// Render the view
	view.render('volunteers');
};
