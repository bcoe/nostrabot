var _ = require('underscore'),
  FeedParser = require('feedparser'),
  request = require('request');

function RSSReader(opts) {
  this.feedURL = 'http://feeds.foxnews.com/foxnews/latest.rss';
}

RSSReader.prototype.getArticles = function(callback) {
  var _this = this;
  
  this._getRawFeed(function(err, feed) {

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

RSSReader.prototype._getRawFeed = function(callback) {
  request({
    url: this.feedURL
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