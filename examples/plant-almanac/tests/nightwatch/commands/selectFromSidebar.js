exports.command = function(sidebarButtonElement) {

  this
    .waitForElementVisible(sidebarButtonElement, 1000)
    .click(sidebarButtonElement).pause(1000)

  return this; // allows the command to be chained.
};
