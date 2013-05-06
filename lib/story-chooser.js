var _ = require('underscore');

function StoryChooser(opts) {
  _.extend(this, {
    keywords: [
      'missile',
      'chemical',
      'biological',
      'weapon',
      'military',
      'die ',
      'tragedy',
      'explode',
      'explosion',
      'bomb',
      'nuclear',
      'threat',
      'war ',
      'middle east'
    ]
  }, opts);
}

StoryChooser.prototype.chooseStory = function(stories, callback) {

};

StoryChooser.prototype._findCandidateStories = function(stories) {
  var candidateStories = [];
};

exports.StoryChooser = StoryChooser;