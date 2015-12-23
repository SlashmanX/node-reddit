var request = require('superagent');
var Promise = require('bluebird');
var _ = require('lodash');
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
	return new Promise(function (resolve, reject) {
		var limit = null;
		if(opts.limit) limit = opts.limit;
		var after = opts.after;
		var result = {};
		result.submissions = [];

		async.doWhilst(function(cb) {
			if(after) {
				opts.after = after;
				opts.count = result.length;
			}
			self.get(endpoint, opts)
			.then(function(res){
				res = JSON.parse(res);
				after = res.data.after;
				result.submissions = _.union(result.submissions, _.map(res.data.children, function(s) { return s.data}));
				cb();
			}).catch(function(err) {
				cb(err);
			})
		},
		function() {
			return !(after === null || (opts.limit !== null && result.submissions.length >= opts.limit));
		},
		function(err) {
			result.after = after;
			if(err) return reject(err);
			else return resolve(result);
		})

	})
};

Agent.prototype.submissionHandler = function(endpoint, opts) {
	return new Promise(function (resolve, reject) {
		var sub = {};
		sub.submission = {};
		sub.comments = [];
		var after = opts.after;
		self.get(endpoint, opts)
		.then(function (res){
			res = JSON.parse(res);
			sub.submission = res[0].data.children[0].data;
			sub.comments = _.union(sub.comments, res[1].data.children);
			sub.comments = commentsHandler(sub.comments);
			return resolve(sub);
		}).catch(function(err) {
			console.log(err);
			return reject(err);
		});

	});
};
function commentsHandler(comments) {
	var parsedComments = [];
	var c;
	_.each(comments, function(comment, index, list) {
		c = comment.data;
		if(c.replies) {
			c.replies = repliesHandler(c.replies);
		}
		parsedComments.push(c);
	});

	return parsedComments;
}
function repliesHandler(replies) {
	var parsedReplies = [];
	var r;
	_.each(replies.data.children, function(reply, index, list) {
		r = reply.data;
		if(r.replies) {
			r.replies = repliesHandler(r.replies);
		}
		parsedReplies.push(r);
	});

	return parsedReplies;
}
Agent.prototype.get = function(endpoint, getVariables) {
	return new Promise(function (resolve, reject) {

		getVariables = getVariables || {};
		console.log(endpoints.BASE_URL + endpoint);
		console.log(self.token);

		request
			.get(endpoints.BASE_URL + endpoint)
			.set('Authorization', 'bearer '+ self.token)
			.set('User-Agent', 'node-reddit 0.0.1 by SlashmanX')
			.query(getVariables)
			.end(function (err, res) {
				if(res.ok) {
					return resolve(JSON.stringify(res.body));
				} else {
					return reject(res.text);
				}
			});

	});
};

Agent.prototype.post = function(endpoint, postVariables) {
	return new Promise(function (resolve, reject) {

		postVariables = postVariables || {};

		request
			.post(endpoints.BASE_URL + endpoint)
			.set('Authorization', 'bearer '+ self.token)
			.set('User-Agent', 'node-reddit 0.0.1 by SlashmanX')
			.type('application/x-www-form-urlencoded')
			.send(postVariables)
			.end(function (err, res) {
				if(res.ok) {
					return resolve(JSON.stringify(res.body));
				} else {
					return reject(res.text);
				}
			});

	});
};

Agent.prototype.identity = {
	me: function() {
		return self.get(endpoints.identity.me);
	}
}

Agent.prototype.mysubreddits = {
	subscriber: function() {
		return new Promise(function (resolve, reject) {
			self.listingHandler(endpoints.mysubreddits.subscriber, {})
			.then(function(subs) {
				return resolve(JSON.stringify(subs));
			})
			.catch(function(err){
				return reject(err);
			});
		});
	}
}

Agent.prototype.read = {
	homepage: function(opts) {
		return new Promise(function (resolve, reject) {
			if(!opts.limit) opts.limit = 25;

			self.listingHandler(endpoints.read.homepage.replace('{sort}', opts.sort), opts)
			.then(function (list) {
				return resolve(JSON.stringify(list));
			})
			.catch(function (err){
				return reject(err);
			});
		});
	},
	r: function(r, opts) {
		return new Promise(function (resolve, reject) {
			if(!opts.limit) opts.limit = 25;

			self.listingHandler(endpoints.read.r.replace('{sub}', r).replace('{sort}', opts.sort), opts)
			.then(function (list) {
				return resolve(JSON.stringify(list));
			})
			.catch(function (err){
				return reject(err);
			});
		});
	},

	submission: function(article, opts) {
		return new Promise(function (resolve, reject) {

			self.submissionHandler(endpoints.read.submission.replace('{article}', article), opts)
			.then(function (sub) {
				return resolve(JSON.stringify(sub));
			})
			.catch(function (err){
				return reject(err);
			});
		});
	}
}

Agent.prototype.vote = function(opts) {
	return new Promise(function (resolve, reject) {
		self.post(endpoints.vote, opts)
		.then(function() {
			return resolve();
		})
		.catch(function (err) {
			return reject(err);
		})
	});
}

module.exports = Agent;
