exports.command = function() {
  this
    .waitForElementVisible('#privacyPage', 1000)

  return this;
};
