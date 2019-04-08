var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Location Model
 * ==================
 */

var Configuration = new keystone.List('Configuration', {
	//nocreate:true
});

Configuration.add({
	currentYear: {
		type: Number,
		required: true,
		default: new Date().getFullYear()
	},
	promoBanner: {
		type: Types.Relationship,
		ref: 'PromoBanner'
	}
});

Configuration.register();
