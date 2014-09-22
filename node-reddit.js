var Q = require('q');
var agent = require('./lib/agent.js');

var TOKEN = '';

exports.Reddit = function(token) {
	this.TOKEN = token;
}

exports.Reddit.prototype.user = function(username) {
	var defer = Q.defer();
	agent.getAccountInfo(username, function(err, res) {
		if(err) defer.reject(err);
		defer.resolve(res);
	})
	return defer.promise;
}

exports.Reddit = Reddit;