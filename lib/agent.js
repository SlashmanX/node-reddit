var request = require('superagent');
var Q = require('q');
var _ - require('underscore');
var endpoints = require('./endpoints.js');
var token = '';
var self;

var Agent = function(token) {
	this.token = token;
	self = this;
};

Agent.prototype.setToken(token) {
	this.token = token;
};

Agent.prototype.get = function(endpoint, getVariables) {
	var defer = Q.defer();

	getVariables = getVariables || {};

	request
		.get(endpoints.BASE_URL + endpoint)
		.set('Authorization', 'bearer '+ this.token)
		.set('User-Agent', 'node-reddit 0.0.1')
		.query(getVariables)
		.end(function(res) {
			if(res.ok) {
				defer.resolve(JSON.stringify(res.body));
			} else {
				defer.reject(res.text);
			}
		});

	return defer.promise;
};

Agent.prototype.post = function(endpoint, postVariables) {
	var defer = Q.defer();

	postVariables = postVariables || {};

	getVariables = getVariables || {};

	request
		.get(endpoints.BASE_URL + endpoint)
		.set('Authorization', 'bearer '+ this.token)
		.set('User-Agent', 'node-reddit 0.0.1')
		.send(postVariables)
		.end(function(res) {
			if(res.ok) {
				defer.resolve(JSON.stringify(res.body));
			} else {
				defer.reject(res.text);
			}
		});

	return defer.promise;
};

Agent.prototype.identity = {
	me: function() {
		return self.get(endpoints.identity.me);
	}
}

Agent.prototype.mysubreddits = {
	var defer = Q.defer();
	subscriber: function() {
		self.get(endpoints.mysubreddits.subscriber)
		.then(function(subs) {
			subs = _.map(subs.data.children, function(s) { return s.data});
			defer.resolve(subs);
		})
		.catch(function(err){
			defer.reject(err);
		})
	}

	return defer.promise;
}

module.exports = Agent;