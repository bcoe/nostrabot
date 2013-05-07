var _ = require('underscore'),
  redis = require('redis');

function StoryChooser(opts) {
  _.extend(this, {
    environment: 'production',
    keywords: [
      'missile',
      'chemical',
      'biological',
      'military',
      'tragedy',
      'explode',
      'explosion',
      'bomb',
      'nuclear',
      'war ',
      'middle east',
      'terror ',
      'terrorism',
      'terrorist',
      'bomber',
      'havoc',
      'deadly',
      'murdered',
      'murderer',
      'air strike',
      'warfare',
      'fireball',
      'extremist',
      'battle',
      'chaos',
      'volcano',
      'earthquake',
      'slain',
      'revolt',
      'insurgents',
      'cyberattack',
      'tsunami'
    ],
    client: process.env.REDISTOGO_URL ? require('redis-url').connect(process.env.REDISTOGO_URL) : redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST)
  }, opts);

  this.publishedStoriesKey = this.environment + '_stories_published';
}

StoryChooser.prototype.chooseStory = function(stories, callback) {
  var candidateStories = this._findCandidateStories(stories);

  this._chooseStoryForPublication(candidateStories, function(story) {
    callback(story);
  });
};

StoryChooser.prototype._findCandidateStories = function(stories) {
  var _this = this,
    candidateStories = [];

  // Iterate over each news story found.
  stories.forEach(function(story) {

    // Find story titles that contain the keyword.
    _this.keywords.forEach(function(keyword) {
      if (story.title.toLowerCase().indexOf(keyword) > -1) {
        candidateStories.push(story);
      }
    });

  });
  return candidateStories;
};

StoryChooser.prototype._chooseStoryForPublication = function(candidateStories, callback) {
  var _this = this,
    story = candidateStories.shift();

  // we've run out of candidate stories.
  // to choose from.
  if (!story) {
    callback(undefined);
    return;
  }

  // check whether we've published this story before.
  this.client.sismember(this.publishedStoriesKey, story.title, function(err, isMember) {
    if (err) {
      console.log(err);
      callback(undefined);
    }

    // if story is in set of the stories we have
    // already published. don't publish, test
    // next andidate story.
    if (isMember) { 
      _this._chooseStoryForPublication(candidateStories, function(story) {
        callback(story);
      });
    } else { // this story is cool to publish.
      _this.client.sadd(_this.publishedStoriesKey, story.title, function() {
        callback(story);
      });
    }
  });
};

exports.StoryChooser = StoryChooser;