var Reddit = require('./node-reddit');
var reddit = new Reddit('10091845-ozSJsxhks7LKlX8_eOiXOlQ5Xgc');

reddit
	.r('soccer', {'sort': 'new'})
	.then(function(res) {
		console.log(res);
	}).catch(function(err){
		console.error(err);
	});
