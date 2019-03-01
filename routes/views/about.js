var keystone = require('keystone');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	var directorsContentSlug='content-board-of-directors';
	var orienteeringLinksContentSlug='content-orienteering-links';
	var volunteersContentSlug='content-volunteers';

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'about';

	locals.data = {
		directorsContent: {},
		orienteeringLinksContent: {},
		volunteersContent: {}
	};


	//load directors content
	view.on('init', function(next) {
		keystone.list('Post').schema.methods.loadPost(directorsContentSlug, function(err, result){
			locals.data.directorsContent = result;
			next(err);
		});
	});

	//load volunteers content
	view.on('init', function(next) {
		keystone.list('Post').schema.methods.loadPost(volunteersContentSlug, function(err, result){
			locals.data.volunteersContent = result;
			next(err);
		});
	});

	//load links content
	view.on('init', function(next) {
		keystone.list('Post').schema.methods.loadPost(orienteeringLinksContentSlug, function(err, result){
			locals.data.orienteeringLinksContent = result;
			next(err);
		});
	});

	// Render the view
	view.render('about');

};
