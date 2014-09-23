var Q = require('q');
var Agent = require('./lib/agent.js');
var agent;

var TOKEN = '';

var Reddit = function(token) {
	this.TOKEN = token;
	agent = new Agent(token);
}

Reddit.prototype.u = function(username) {
	var defer = Q.defer();
	if(!username) return agent.identity.me();
	return agent.identity.me();
}

module.exports = Reddit;