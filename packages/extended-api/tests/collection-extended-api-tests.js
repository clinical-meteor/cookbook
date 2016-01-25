
if(Meteor.isServer){
  Tinytest.add('collection - drop()', function (test) {
    var Foo = new Mongo.Collection(null);
    Foo.insert({text: "foo"});

    test.equal(Foo.find().count(), 1);

    Foo.drop();
    test.equal(Foo.find().count(), 0);

    Foo = null;
  });
}
