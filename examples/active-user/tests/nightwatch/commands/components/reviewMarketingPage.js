exports.command = function() {
  this
    .waitForElementVisible('#marketingPage', 1000)

  return this; 
};
