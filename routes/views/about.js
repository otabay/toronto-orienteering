var keystone = require('keystone');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	var directorsContentSlug='content-board-of-directors';
	var orienteeringLinksContentSlug='content-orienteering-links';

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'about';

	locals.data = {
		directorsContent: {},
		orienteeringLinksContent: {}
	};


	//load directors content content
	view.on('init', function(next) {
		keystone.list('Post').schema.methods.loadPost(directorsContentSlug, function(err, result){
			locals.data.directorsContent = result;
			next(err);
		});
	});

	//load links content content
	view.on('init', function(next) {
		keystone.list('Post').schema.methods.loadPost(orienteeringLinksContentSlug, function(err, result){
			locals.data.orienteeringLinksContent = result;
			next(err);
		});
	});

	// Render the view
	view.render('about');

};
