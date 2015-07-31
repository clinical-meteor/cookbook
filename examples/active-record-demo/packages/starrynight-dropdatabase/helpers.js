// Write your package code here!
Meteor.methods({
  dropCollection:function (collectionName){
    var defaultConnection = MongoInternals.defaultRemoteCollectionDriver();
    defaultConnection.mongo.db.collection(collectionName).drop();
  },
  dropCollections:function (collectionName, port){
    // var db = MongoInternals.defaultRemoteCollectionDriver().mongo.db;
    var defaultConnection = MongoInternals.defaultRemoteCollectionDriver();
    defaultConnection.mongo.db.collectionNames( function (err, collections){
      collections.forEach( function (error, collection){
        // console.log('collection', collections[collection].name);
        var collectionName = collections[collection].name;
        // if(collectionName != "system.users" && collectionName != "system.indexes" && db[collectionName]){
        if(collectionName != "system.users" && collectionName != "system.indexes"){
          console.log('collectionName', collectionName);

          defaultConnection.mongo.db.collection(collectionName).drop();
        }
      });
    });
  }
});
