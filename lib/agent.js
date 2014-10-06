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

Agent.prototype.listingHandler = function(endpoint, opts) {
	var defer = Q.defer();
	var limit = null;
	if(opts.limit) limit = opts.limit;
	var after = opts.after;
	var result = [];

	async.doWhilst(function(cb) {
		if(after) {
			opts.after = after;
			opts.count = result.length;
		}
		self.get(endpoint, opts)
		.then(function(res){
			res = JSON.parse(res);
			after = res.data.after;
			result = _.union(result, _.map(res.data.children, function(s) { return s.data}));
			cb();
		}).catch(function(err) {
			cb(err);
		})
	},
	function() {
		return !(after === null || (opts.limit !== null && result.length >= opts.limit));
	},
	function(err) {
		if(err) defer.reject(err);
		else defer.resolve(result);
	})

	return defer.promise;
};

Agent.prototype.submissionHandler = function(endpoint, opts) {
	console.log(endpoint);
	var defer = Q.defer();
	var sub = {};
	sub.submission = {};
	sub.comments = [];
	var after = opts.after;
	self.get(endpoint, opts)
	.then(function(res){
		res = JSON.parse(res);
		sub.submission = res[0].data.children[0].data;
		sub.comments = _.union(sub.comments, _.map(res[1].data.children, function(s) { return s.data}));
		sub.comments = commentsHandler(sub.comments);
		defer.resolve(sub);
	}).catch(function(err) {
		console.log(err);
		defer.reject(err);
	});

	return defer.promise;
};
function commentsHandler(comments) {
	_.each(comments, function(comment, index, list) {
		if(comment && comment.replies) {
			_.each(comment.replies.data.children, function(reply, index1, list1) {
				comments[index].replies[index1] = commentsHandler(reply.data);
			})
		}
	})

	return comments;
}
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
		self.listingHandler(endpoints.mysubreddits.subscriber, {})
		.then(function(subs) {
			defer.resolve(JSON.stringify(subs));
		})
		.catch(function(err){
			defer.reject(err);
		});
		return defer.promise;
	}
}

Agent.prototype.read = {
	homepage: function(opts) {
		var defer = Q.defer();
		if(!opts.limit) opts.limit = 25;

		self.listingHandler(endpoints.read.homepage, opts)
		.then(function(list) {
			defer.resolve(JSON.stringify(list));
		})
		.catch(function(err){
			defer.reject(err);
		});
		return defer.promise;
	},
	r: function(r, opts) {
		var defer = Q.defer();
		if(!opts.limit) opts.limit = 25;

		self.listingHandler(endpoints.read.r.replace('{sub}', r), opts)
		.then(function(list) {
			defer.resolve(JSON.stringify(list));
		})
		.catch(function(err){
			defer.reject(err);
		});
		return defer.promise;
	},

	submission: function(article, opts) {
		var defer = Q.defer();

		self.submissionHandler(endpoints.read.submission.replace('{article}', article), opts)
		.then(function(sub) {
			defer.resolve(JSON.stringify(sub));
		})
		.catch(function(err){
			defer.reject(err);
		});
		return defer.promise;
	}
}

Agent.prototype.vote = function(opts) {
	var defer = Q.defer();
	self.post(endpoints.vote, opts)
	.then(function() {
		defer.resolve('ok');
	})
	.catch(function(err) {
		defer.reject(err);
	})
	retrun defer.promise;
}

module.exports = Agent;