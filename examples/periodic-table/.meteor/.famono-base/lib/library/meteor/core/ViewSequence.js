Famono.scope('library/meteor/core/ViewSequence', ["famous/core/ViewSequence","library/meteor/core/Surface","library/meteor/core/ReactiveEntity"], function(require, define, exports, module) {
// Credit goes to @gadicc since I let me inspire of some of his code, Thanks! 
define(function(require, exports, module) {
  // options data, template, size, properties
  var _ViewSequence = require("famous/core/ViewSequence");
  var MeteorSurface = require("library/meteor/core/Surface");
  var ReactiveEntity = require("library/meteor/core/ReactiveEntity");

  var ViewSequence = function(options, eventReciever) {
    var self = this;
    var index = {};

    // Create sequence
    var sequence = new _ViewSequence();

    if (_.isArray(options.data)) {
        _.each(options.data, function(row) {

            var temp = new MeteorSurface({
                template: options.template,
                data: row,
                size: options.size,
                properties: options.properties,
                classes: options.classes || []
            });

            if (eventReciever) temp.pipe(eventReciever);
            
            sequence.push(temp);


        });        
    } else if (typeof options.data == 'object') {
        // "data" is a MiniMongo cursor.  TODO, instanceof cursor check.
        self.observeHandle = options.data.observe({
          addedAt: function(doc, atIndex, before) {
            // Keep an reactive index
            index[doc._id] = new ReactiveEntity(doc);

            var temp = new MeteorSurface({
                template: options.template,
                data: index[doc._id].get(),
                size: options.size,
                properties: options.properties
            });
            
            if (eventReciever) temp.pipe(eventReciever);

            // Add surface
            sequence.splice(atIndex, 0, temp);            
          },
          changedAt: function(newDocument, oldDocument, atIndex) {
            index[newDocument._id].set(newDocument);
          },
          removedAt: function(oldDocument, atIndex) {
            // Remove item
            var item = sequence.splice(atIndex, 1);
            // Clean up, help GC
            index[oldDocument._id] = null;
            // Clean up
            delete index[oldDocument._id];
            console.log('Removed', item);
            // item.destroy(); ??
          },
          movedTo: function(doc, fromIndex, toIndex, before) {
            var item = sequence.splice(fromIndex, 1)[0];
            sequence.splice(toIndex, 0, item);
          }
        });
    }

    // Return the sequence handle
    return sequence;
  };

  module.exports = ViewSequence;
});
});