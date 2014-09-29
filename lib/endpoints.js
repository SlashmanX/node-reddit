exports.BASE_URL = 'https://oauth.reddit.com';

// Identity
exports.identity = {};
exports.identity.me = '/api/v1/me';
exports.identity.prefs = '/api/v1/me/prefs';
exports.identity.trophies = '/api/v1/me/trophies';

// Edit
exports.edit = {};
exports.edit.del = '/api/del';
exports.edit.editusertext = '/api/editusertext';
exports.edit.sendreplies = '/api/sendreplies';

// History
exports.history = {};
exports.history.overview = '/user/overview.json';
exports.history.submitted = '/user/username/submitted.json'
exports.history.comments = '/user/comments.json';
exports.history.liked = '/user/liked.json';
exports.history.disliked = '/user/disliked.json';
exports.history.hidden = '/user/hidden.json';
exports.history.saved = '/user/saved.json';
exports.history.gilded = '/user/gilded.json';

// My Subreddits
exports.mysubreddits = {};
exports.mysubreddits.friends = '/api/v1/me/friends/username';
exports.mysubreddits.karma = '/api/v1/me/karma';
exports.mysubreddits.subscriber = '/subreddits/mine/subscriber.json';
exports.mysubreddits.contributor = '/subreddits/mine/contributor.json';
exports.mysubreddits.moderator = '/subreddits/mine/moderator.json';

// Private Messages
exports.privatemessages = {};
exports.privatemessages.block = '/api/block';
exports.privatemessages.compose = '/api/compose';
exports.privatemessages.readmessage = '/api/read_message';
exports.privatemessages.unreadmessage = '/api/unread_message';
exports.privatemessages.inbox = '/message/inbox.json';
exports.privatemessages.unread = '/message/unread.json';
exports.privatemessages.sent = '/message/sent.json';

// Read
exports.read = {};
exports.read.homepage = '/.json';
exports.read.r = '/r/{sub}.json';
