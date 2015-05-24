Famono.scope('library/meteor/core/ReactiveEntity', [], function(require, define, exports, module) {
define(function(require, exports, module) {

    var ReactiveEntity = function(defaultValue) {
    var self = this;
    var value = defaultValue;
    var dep = new Deps.Dependency();

    self.get = function () {
      dep.depend();
      return value;
    };

    self.set = function(newValue) {
      if (newValue !== value) {
        value = newValue;
        dep.changed();
      }
    };
  };

  module.exports = ReactiveEntity;
});
});