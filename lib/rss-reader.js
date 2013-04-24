var _ = require('underscore'),
  FeedParser = require('feedparser'),
  request = require('request');

function RSSReader(opts) {
  _.extend(this, {
    feedUrls: [
      'http://feeds.foxnews.com/foxnews/latest.rss',
      'http://rss.cnn.com/rss/cnn_world.rss'
    ]
  }, opts);
}

RSSReader.prototype.readAllFeeds = function(callback) {
  var _this = this,
    articles = [], // articles collected from all feeds.
    feedUrls = this.feedUrls.slice(0), // clone the feeds array.
    feedUrl = null;

  (function walkFeeds() {
    if (feedUrl = feedUrls.pop()) {
      // there are still more feeds to load.
      _this.readFeed(feedUrl, function(err, newArticles) {
        articles = articles.concat(newArticles);
        walkFeeds();
      });
    } else { 
      // finished reading all feeds.
      callback(null, articles);
    }
  })();
};

RSSReader.prototype.readFeed = function(feedUrl, callback) {
  var _this = this;
  
  this._getRawFeed(feedUrl, function(err, feed) {

    if (err) callback(err, null);

    var articles = [];

    FeedParser.parseString(feed)
      .on('article', function(article) {
        articles.push({
          title: article.title,
          description: article.description || '',
          link: article.link
        });
      })
      .on('end', function() {
        callback(null, articles);
      });
  });
};

RSSReader.prototype._getRawFeed = function(feedUrl, callback) {
  request({
    url: feedUrl
  }, function(err, res, feed) {
    
    if (!res) {
      err = new Error('empty response');
    } else if (res.statusCode < 200 || res.statusCode >= 300) {
      err = new Error('http status ', res.statusCode) 
    }

    callback(err, feed);
  });
};

exports.RSSReader = RSSReader;