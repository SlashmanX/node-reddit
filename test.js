var Reddit = require('./node-reddit');
var reddit = new Reddit('72l8gcTRgRbZotsejYJOhNNzd9A');

reddit
	.u()
	.then(function(res) {
		console.log(res);
	}).catch(function(err){
		console.error(err);
	});
