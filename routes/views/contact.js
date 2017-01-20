var keystone = require('keystone');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res);
	var locals = res.locals;

	var contactUsContentSlug='content-contact-us';

	locals.section = 'contact';

	locals.data = {
		contactUsContent: {},
	};
	
	//load directors content content
	view.on('init', function(next) {
		keystone.list('Post').schema.methods.loadPost(contactUsContentSlug, function(err, result){
			locals.data.contactUsContent = result;
			next(err);
		});
	});
	
	view.render('contact');
	
};
