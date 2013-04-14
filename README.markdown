Nigh-Bot
========

The end of the world is Nigh, and Nigh-Bot is tweeting about it.

Design
------

* We need something to grab in apocalyptic news stories.
* I'll probably want a list of words that sound terrifying, like nuclear.
* I will want something that pulls news in from a few news sources, perhaps just a simple RSS reader.
* We'll want something that tweets appropriate stores using the twitter API.

* RSS Reader.
* Story Chooser.
* Tweeter.

Thus Far
--------
* Created a skeleton project:
    * it has mocha as a dependency.
    * we create a Makefile for running the mocha tests.
* Did some pen and paper design of our class structure:
    * create the first class only.
    * create a corresponding test file in a test folder.
* Create a first failing test:
    * In our case we read the entries from several RSS feeds.