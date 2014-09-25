var Q = require('q');
var Agent = require('./lib/agent.js');
var agent;

var TOKEN = '';

var Reddit = function(token) {
	this.TOKEN = token;
	agent = new Agent(token);
}

Reddit.prototype.setToken = function(token) {
	this.TOKEN = token;
	agent.setToken(token);
};

Reddit.prototype.u = function(username) {
	var defer = Q.defer();
	if(!username) return agent.identity.me();
	return agent.identity.me();
};

Reddit.prototype.r = function(sub) {
	var defer = Q.defer();
	if(!sub) return agent.mysubreddits.subscriber();
	return agent.mysubreddits.subscriber();
}

Reddit.prototype.homepage = function(opts) {
	return agent.read.hot(opts);
}

module.exports = Reddit;