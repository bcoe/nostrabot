var assert = require('assert'),
  Tweeter = require('../lib').Tweeter,
  sinon = require('sinon');

describe('Tweeter', function() {
  describe('#createStatusFromArticle', function() {
    // Note twitter shortens links to 22 characters.
    // therefore we have 119 characters to work with.
    it("should tweet the full title of article if it's under 120 characters", function() {
      var tweeter = new Tweeter(),
        status = tweeter.createStatusFromArticle({
          title: "Tsarneav mom: I'm like 'a dead person'",
          link: "http://rss.cnn.com/~r/rss/cnn_world/~3/4_Vlvcs00K8/index.html"
        });

      assert(status.indexOf("Tsarneav mom: I'm like 'a dead person'") > -1);
      assert(status.indexOf("http://rss.cnn.com/~r/rss/cnn_world/~3/4_Vlvcs00K8/index.html") > -1);
    });

    it("it should shorten the article and add an elipses if it's too long", function() {
      var tweeter = new Tweeter(),
        article = {
          title: "TECH SUPPORT NEEDED:Ex-Attorney General Says Bombers Likely Had Help TECH SUPPORT NEEDED:Ex-Attorney General Says Bombers Likely Had Help",
          link: "http://t.co/UoJ1OadP6D"
        },
        status = tweeter.createStatusFromArticle(article);

        assert.equal(status.length - ' '.length - article.link.length, 117);
        assert.equal(status.length, 140);
        assert(status.indexOf('…') > -1);
    });
  });
});