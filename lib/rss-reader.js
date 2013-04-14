var _ = require('underscore'),
  jDistiller = require('jdistiller').jDistiller;

function RSSReader(opts) {
  this.parser = this._createParser();
}

RSSReader.prototype._createParser = function() {
  return new jDistiller()
    .set('items', 'item', function(element) {

      // link is a reserved word in HTML, and is
      // collapsed by JSDom into a self-closing
      // element, we can grab the link out by looking
      // for a dangling text node.
      var link = element
        .contents()
        .filter(function() {
          return this.nodeType === 3;
        });

      return [{
        title: element.find('title').text().trim(),
        href: link.text().trim()
      }]
    });
};

RSSReader.prototype.getItems = function(callback) {
  this._parseFeed(callback);
};

RSSReader.prototype._parseFeed = function(callback) {
  var data = "<atom><item><title>KELSEY'S LAW PUSH: Could Cellphone Companies Save Lives?</title><link>http://foobar.com</link></item></atom>";
  this.parser.distillString(data, function(error, items) {
    callback(items.items);
  });
};

exports.RSSReader = RSSReader;