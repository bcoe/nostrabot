var assert = require('assert'),
  RSSReader = require('../lib').RSSReader,
  sinon = require('sinon'),
  fs = require('fs');

describe('RSSReader', function() {

  describe('#readAllFeeds', function() {

    it('should call #readFeed for each source in feeds', function(done) {
      var rssreader = new RSSReader({
          feedUrls: ['http://example.com/foo.rss', 'http://example.com/bar.rss']
        }),
        fakeNewsArticle = {
          title: 'Fake News',
          desciption: 'Hey, I am fake news!'
        };

      // mock the readFeed method on our RSS reader using sinon.
      rssreader.readFeed = sinon.mock().callsArgWith(1, [fakeNewsArticle]).twice();

      rssreader.readAllFeeds(function(err, articles) {
        assert.equal(articles.length, 2);
        done();
      });

    });
    
    it("should return an array of articles from a given RSS feed", function(done) {
      var rssreader = new RSSReader({
          feedUrls: ['http://example.com/foo.rss', 'http://example.com/bar.rss']
        }),
        feeds = {
          'http://example.com/foo.rss': fs.readFileSync('./test/fixtures/fox.rss').toString(),
          'http://example.com/bar.rss': fs.readFileSync('./test/fixtures/cnn.rss').toString()
        };

      // return our fixture rather than connecting to
      // the real RSS feed.
      rssreader._getRawFeed = function(feedUrl, callback) {
        callback(null, feeds[feedUrl]);
      };
      
      rssreader.readAllFeeds(function(err, articles) {
        assert.equal(articles[0].title, "Arwa Damon: Freeze-frame moments");
        assert.equal(articles[articles.length - 1].title, "Adorable Alert: Newborn Pups");
        done();
      });
    });

  });
});