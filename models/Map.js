var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Map Model
 * ==================
 */

var Map = new keystone.List('Map', {
	autokey: { from: 'name', path: 'key', unique: true }
});

Map.add({
	name: { type: String, required: true },
	scale: { type: Types.Select, options:['1/2500','1/4000','1/5000','1/7500','1/10000','1/15000'] },
	contourInterval: { type: Types.Select, options:['1m','3m','5m']},
	revision: { type: String },
	imageUrl: { type: Types.Url }
});


Map.register();
