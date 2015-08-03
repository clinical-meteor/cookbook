
Foo = new Meteor.Collection('foo');

Foo.allow({
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


FooSchema = new SimpleSchema({
  title: {
    type: String,
    label: "Title",
    max: 200
  },
  url: {
    type: String,
    label: "Web Address - http://www.widget.com"
  },
  imageUrl: {
    type: String,
    label: "Image Url - http://www.widget.com/cog.jpg"
  },
  description: {
    type: String,
    label: "Description"
  }
});
Foo.attachSchema(FooSchema);
