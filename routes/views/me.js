var keystone = require('keystone'),
	_ = require('underscore'),
	moment = require('moment');


exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	locals.section = 'me';
	locals.page.title = 'Settings';	
	
	
	view.render('me');
	
}
