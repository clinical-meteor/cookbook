SyncedCron.add({
  name: 'Remove all the horses and reset.',
  schedule: function(parser) {
    // parser is a later.parse object
    return parser.text('at 2:00am every day');
  },
  job: function() {
    /*var horses = Foo.find().fetch();
    horses.forEach(function(horse){
      Foo.remove({_id: horse._id});
    });*/

    Foo.remove({});
    Meteor.call('addHorses');
    return true;
  }
});
SyncedCron.start();
