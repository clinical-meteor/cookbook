// add tests to this file using the Nightwatch.js API
// http://nightwatchjs.org/api


// EXPERIMENTAL
// The following code is experimental and not fully tested.
// In particular, the ID of the post is probably not going to be 314159
// unless you inject a post into the database with that ID
// which is something you might want to do

module.exports = {
  "REST API Walkthrough" : function (client) {
    client

    .url("http://localhost:3000/api/find/posts")
      .waitForElementVisible("body", 1000)
      .verify.containsText('body', 'Found some posts...')

    .url("http://localhost:3000/api/insert/post")
      .waitForElementVisible("body", 1000)
      .verify.containsText('body', 'New post has an ID of')

    .url("http://localhost:3000/api/find/post/314159")
      .waitForElementVisible("body", 1000)
      .verify.containsText('body', 'Post contents...')

    .url("http://localhost:3000/api/update/post/314159")
      .waitForElementVisible("body", 1000)
      .verify.containsText('body', 'Result of updating post is')

    .url("http://localhost:3000/api/delete/post/314159")
      .waitForElementVisible("body", 1000)
      .verify.containsText('body', 'Result of deleting post is')

    .end();
  }
};
