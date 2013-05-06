var _ = require('underscore'),
  FeedParser = require('feedparser'),
  request = require('request'),
  async = require('async');

function RSSReader(opts) {
  _.extend(this, {
    feedUrls: [
      'http://feeds.foxnews.com/foxnews/latest.rss',
      'http://rss.cnn.com/rss/cnn_world.rss',
      'http://feeds.bbci.co.uk/news/rss.xml',
      'http://online.wsj.com/xml/rss/3_7085.xml',
      'http://www.nypost.com/rss/newscore.xml'
    ]
  }, opts);
}

RSSReader.prototype.readAllFeeds = function(callback) {
  var _this = this,
    readWork = [];

  // Create read work for each of our feed URLs.
  this.feedUrls.forEach(function(feedUrl) {
    readWork.push(function(callback) {
      _this.readFeed(feedUrl, callback);
    });
  });

  // Use the async library to do all of the work in parallel.
  async.parallel(readWork, function(err, articlesByFeed) {
    var allArticles = [];

    (articlesByFeed || []).forEach(function(articles) {
      allArticles.push.apply(allArticles, articles);
    });

    callback(err, allArticles); // return the results of the parallel work.
  });
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