module.exports = function() {

  this.Given(/^I open Google's search page$/, function() {
    this
      .url('http://google.com')
      .waitForElementVisible('body', 1000);
  });

  this.Then(/^the title is "([^"]*)"$/, function(title) {
    this.assert.title(title);
  });

  this.Then(/^the search form exists$/, function() {
    this.assert.visible('input[name="q"]');
  });

};.
