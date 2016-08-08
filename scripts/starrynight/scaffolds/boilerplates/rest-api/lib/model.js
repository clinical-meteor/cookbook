
Statistics = new Meteor.Collection("statistics", {idGeneration : 'MONGO'});
Statistics.allow({
  insert: function(){
    return true;
  },
  update: function () {
    return true;
  },
  remove: function(){
    return true;
  }
});


Posts = new Meteor.Collection("posts", {idGeneration : 'MONGO'});
Posts.allow({
  insert: function(){
    return true;
  },
  update: function () {
    return true;
  },
  remove: function(){
    return true;
  }
});