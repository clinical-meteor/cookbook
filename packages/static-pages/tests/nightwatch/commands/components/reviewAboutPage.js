exports.command = function() {
  this
    .waitForElementVisible('#aboutPage', 1000)

  return this; 
};
