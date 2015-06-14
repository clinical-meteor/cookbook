exports.command = function() {
  this
    .waitForElementVisible('#eulaPage', 1000)

  return this;
};
