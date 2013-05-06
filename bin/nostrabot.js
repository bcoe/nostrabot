#!/usr/bin/env node

var optimist = require('optimist'),
  RSSReader = require('../lib').RSSReader,
  StoryChooser = require('../lib').StoryChooser,
  Tweeter = require('../lib').Tweeter;

var argv = optimist
  .options('c', {
    alias: 'choose',
    describe: 'Choose a story to publish.'
  })
  .options('d', {
    alias: 'daemon',
    describe: 'run as daemon process'
  })
  .usage("Usage:\n\
    \tnostrabot --choose\tchoose a story to publish from our set of RSS feeds.\n\
  ")
  .argv;

// publish story method used by both daemon and single
// run of twitter bot.
function publishStory(rssReader, storyChooser, tweeter) {
  rssReader.readAllFeeds(function(err, stories) {
    
    if (err) {
      console.log('an error occurred', err);
      return;
    }

    console.log('found ', stories.length, 'articles.');

    console.log('finding candidate story to publish.')
    storyChooser.chooseStory(stories, function(story) {
      if (story) {
        console.log('found story', story.title);
        tweeter.tweetArticle(story);
      } else {
        console.log('no story found.')
      }
    });

  });
}

if (argv.choose) { // Publish a single story for testing purposes.
  var rssReader = new RSSReader(),
    storyChooser = new StoryChooser(),
    tweeter = new Tweeter();

  publishStory(rssReader, storyChooser, tweeter);

} else if (argv.daemon) { // start a daemon that publishes stories.
  var rssReader = new RSSReader(),
    storyChooser = new StoryChooser(),
    tweeter = new Tweeter();

  setInterval(function() {
    publishStory(rssReader, storyChooser, tweeter);
  }, 300 * 1000) // tweet once every 5 minutes.
} else {
  console.log(optimist.help());
}