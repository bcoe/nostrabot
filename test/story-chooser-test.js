var assert = require('assert'),
  StoryChooser = require('../lib').StoryChooser,
  sinon = require('sinon'),
  redis = require("redis");

describe('StoryChooser', function() {
  describe('#chooseStory', function() {

    beforeEach(function() {
      var client = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST);
      client.del('test_stories_published');
    });

    it('should choose stories based on a set of keywords', function(done) {
      var storyChooser = new StoryChooser({
        environment: 'test'
      })
      storyChooser.chooseStory([
        {
          title: 'nuclear war korea'
        }, 
        {
          title: "dogs sure are cute aren't they"
        }
      ], function(chosenStory) {
        assert.equal('nuclear war korea', chosenStory.title)
        done();
      });
    });

    it('should not allow the same story to be published twice', function(done) {
      var storyChooser = new StoryChooser({
        environment: 'test'
      })
      
      storyChooser.chooseStory([{title: 'nuclear war korea'}], function(chosenStory) {
        
        // should choose the story for publication the first time.
        assert.equal('nuclear war korea', chosenStory.title)
        
        // should not choose the story for publication the second time.
        storyChooser.chooseStory([{title: 'nuclear war korea'}], function(chosenStory) {
          assert.equal(undefined, chosenStory);
          done();
        });

      });
    });

   /* it('should rank stories higher that match multiple keywords', function(done) {
      done();
    });

    it('should rank stories higher that match keywords and have shorter titles', function(done) {
      done();
    });*/

  });
});