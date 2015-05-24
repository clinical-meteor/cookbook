(function(){
Elements = new Meteor.Collection('Elements');

Elements.allow({
  insert: function(){
    return true;
  },
  update: function(){
    return true;
  },
  remove: function(){
    return true;
  }
});

})();
