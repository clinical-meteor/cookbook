 
 
````js
/************************ Collections ****************************************/
Tickets = new Meteor.Collection('tickets');
var cursor = Tickets.find({}, {sort: {priority:1}});

function reset () {
  Tickets.remove({});
}

function seed () {
  reset();
  for (var i = 0; i < 5; i++) {
    Tickets.insert({
      subject: 'Ticket ' + i,
      description: 'Some description for the ticket',
      priority: Math.round(Math.random() * 10)
    });
  }
}
/*****************************************************************************/

/************************ Server *********************************************/
if (Meteor.isServer) {
  Meteor.startup(seed);

  Meteor.publish('tickets', function () {
    return cursor;
  });
}
/*****************************************************************************/

/************************ Client *********************************************/
if (Meteor.isClient) {
  var sub = Meteor.subscribe('tickets');

  MyPackery = {
    // Singleton instance
    inst: null,

    // Use underscore's _.once functio to make sure this is only called
    // once. Subsequent calls will just return.
    init: _.once(function (container) {
      MyPackery.inst = new Packery(container, {
        gutter: 10
      });
    }),

    update: function () {
      var self = this;
      if (this.inst) {
        // Wait until dependencies are flushed and then force a layout
        // on our packery instance
        Deps.afterFlush(function () {
          self.inst.reloadItems();
          self.inst.layout();
        });
      }
    },

    observeChanges: function (cursor) {
      // Call observeChanges after the {{#each}} helper has had a chance
      // to execute because it also uses observeChanges and we want our code
      // to run after Meteor's. This way Spark will be done with all the
      // rendering work by the time this code is called.
      Meteor.startup(function () {
        cursor.observeChanges({
          addedBefore: function (id) {
            MyPackery.update();
          },

          movedBefore: function (id) {
            MyPackery.update();
          },

          removed: function (id) {
            MyPackery.update();
          }
        });
      });
    }
  };

  // Initialize packery on the first render of the ticketGrid
  Template.ticketGrid.rendered = function () {
    MyPackery.init(this.firstNode);
  };

  // Respond to added, moved, removed callbacks on the
  // tickets cursor
  MyPackery.observeChanges(cursor);

  Template.ticketGrid.helpers({
    tickets: function () {
      return cursor;
    }
  });
}
/*****************************************************************************/
````
