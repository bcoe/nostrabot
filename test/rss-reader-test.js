var assert = require('assert'),
  RSSReader = require('../lib').RSSReader,
  fs = require('fs');

describe('RSSReader', function() {
  describe('#getArticles', function() {
    
    it("should return an array of articles from an RSS feed", function(done) {
      var rssreader = new RSSReader(),
        article = fs.readFileSync('./test/fixtures/fox.rss').toString();

      // Return our fixture rather than connecting to
      // the real RSS feed.
      rssreader._getRawFeed = function(callback) {
        callback(null, article);
      };
      
      rssreader.getArticles(function(err, articles) {
        assert.equal(articles[0].title, "KELSEY'S LAW PUSH: Could Cellphone Companies Save Lives?");
        done();
      });
    });

  });
});