var assert = require('assert'),
  RSSReader = require('../lib').RSSReader;

suite('nigh-bot', function() {
  test('getItems should return an array of current news items', function() {
    var rssreader = new RSSReader();
    
    rssreader.getItems(function(items) {
      assert.equal(items[0].title, "KELSEY'S LAW PUSH: Could Cellphone Companies Save Lives?");
    });

  });
});