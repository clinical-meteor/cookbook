exports.command = function() {
  this
    .waitForElementVisible('#supportPage', 1000)

  return this;
};
