var request = require('superagent');
var Q = require('q');
var _ = require('underscore');
var async = require('async');
var endpoints = require('./endpoints.js');
var token = '';
var self;

var Agent = function(token) {
	this.token = token;
	self = this;
};

Agent.prototype.setToken = function(token) {
	this.token = token;
};

Agent.prototype.listingHandler = function(endpoint) {
	var defer = Q.defer();
	var after = null;
	var result = [];

	async.doWhilst(function(cb) {
		self.get(endpoint, {after: after, count: result.length})
		.then(function(res){
			res = JSON.parse(res);
			after = res.data.after;
			result = _.union(result, _.map(res.data.children, function(s) { return s.data}));
		})
	},
	function() {
		return after !== null;
	},
	function(err) {
		if(err) defer.reject(err);
		else defer.resolve(result);
	})

	return defer.promise;
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
	subscriber: function() {
		var defer = Q.defer();
		self.listingHandler(endpoints.mysubreddits.subscriber)
		.then(function(subs) {
			subs = JSON.parse(subs);
			defer.resolve(JSON.stringify(subs));
		})
		.catch(function(err){
			defer.reject(err);
		});
		return defer.promise;
	}

}

module.exports = Agent;