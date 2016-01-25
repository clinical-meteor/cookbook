
Mongo.Collection.prototype.drop = function(){
  var self = this;
  self._collection.remove({});
};
