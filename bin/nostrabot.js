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

if (argv.choose) {
  console.log('Grabbing stories from RSS feeds...');
  new RSSReader().readAllFeeds(function(err, stories) {
    
    if (err) {
      console.log('an error occurred', err);
      return;
    }

    console.log('found ', stories.length, 'articles.');

    console.log('finding candidate story to publish.')
    new StoryChooser().chooseStory(stories, function(story) {
      if (story) {
        console.log('found story', story.title);
        new Tweeter().tweetArticle(story);
      } else {
        console.log('no story found.')
      }
    });

  });
} else if (argv.daemon) {
  var rssReader = new RSSReader(),
    storyChooser = new StoryChooser(),
    tweeter = new Tweeter();

  setInterval(function() {

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

  }, 300 * 1000) // tweet once every 5 minutes.
} else {
  console.log(optimist.help());
}