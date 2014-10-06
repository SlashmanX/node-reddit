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

Reddit.prototype.r = function(sub, opts) {
	var defer = Q.defer();
	return agent.read.r(sub, opts);
}

Reddit.prototype.subscriber = function() {
	return agent.mysubreddits.subscriber();
}

Reddit.prototype.homepage = function(opts) {
	return agent.read.homepage(opts);
}

Reddit.prototype.submission = function(article, opts) {
	return agent.read.submission(article, opts);
}

Reddit.prototype.vpvote = function(thing) {
	return agent.vote({
		id: thing,
		dir: 1
	})
}

Reddit.prototype.downvote = function(thing) {
	return agent.vote({
		id: thing,
		dir: -1
	})
}

Reddit.prototype.unvote = function(thing) {
	return agent.vote({
		id: thing,
		dir: 0
	})
}

module.exports = Reddit;