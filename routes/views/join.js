var keystone = require('keystone');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	var joinContentSlug='content-join';

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'join';

	locals.data = {
		joinContent: {},
	};


	//load directors content content
	view.on('init', function(next) {
		keystone.list('Post').schema.methods.loadPost(joinContentSlug, function(err, result){
			locals.data.joinContent = result;
			next(err);
		});
	});

	// Render the view
	view.render('join');

};
