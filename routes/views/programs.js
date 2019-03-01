var keystone = require('keystone');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	var youthProgramContentSlug='content-youth-program';
	var beginnersClinicContentSlug='content-beginners-clinic';
	var advancedClinicContentSlug='content-advanced-clinic';
	var certificationsContentSlug='content-certifications';
	var teamBuildingContentSlug='content-team-building';
	var schoolEventsContentSlug='content-orienteering-for-schools';

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'education';

	locals.data = {
		youthProgramContent: {},
		beginnersClinicContent: {},
		advancedClinicContent: {},
		certificationsContent: {},
		teamBuildingContent: {},
		schoolEventsContent: {},
		beginnersClinicSchedule:[],
		advancedClinicSchedule:[]
	};


		//load beginner clinic content content
		view.on('init', function(next) {
			keystone.list('Post').schema.methods.loadPost(beginnersClinicContentSlug, function(err, result){
				locals.data.beginnersClinicContent = result;
				next(err);
			});
		});
	
		//load beginner clinic schedule
		view.on('init', function(next) {
			keystone.list('Event').schema.methods.eventsWithClinic(function(err, results){
				if(results){
					results.forEach(function(clinic) {
						if(clinic.clinicType == "Beginner"){
							locals.data.beginnersClinicSchedule.push(clinic);
						}
						if(clinic.clinicType == "Advanced") {
							locals.data.advancedClinicSchedule.push(clinic);
						} 	
					}, this);
				}
				next(err);
			});
		});

		//load advanced clinic content content
		view.on('init', function(next) {
			keystone.list('Post').schema.methods.loadPost(advancedClinicContentSlug, function(err, result){
				locals.data.advancedClinicContent = result;
				next(err);
			});
		});
	
		//load team building content content
		view.on('init', function(next) {
			keystone.list('Post').schema.methods.loadPost(teamBuildingContentSlug, function(err, result){
				locals.data.teamBuildingContent = result;
				next(err);
			});
		});
	
		//load school events content content
		view.on('init', function(next) {
			keystone.list('Post').schema.methods.loadPost(schoolEventsContentSlug, function(err, result){
				locals.data.schoolEventsContent = result;
				next(err);
			});
		});

		//youth program content
		view.on('init', function(next) {
			keystone.list('Post').schema.methods.loadPost(youthProgramContentSlug, function(err, result){
				locals.data.youthProgramContent = result;
				next(err);
			});
		});

		//certifications content
		view.on('init', function(next) {
			keystone.list('Post').schema.methods.loadPost(certificationsContentSlug, function(err, result){
				locals.data.certificationsContent = result;
				next(err);
			});
		});

	// Render the view
	view.render('programs');
};