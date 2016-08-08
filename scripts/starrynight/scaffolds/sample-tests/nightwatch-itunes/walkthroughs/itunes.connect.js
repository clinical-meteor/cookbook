// add tests to this file using the Nightwatch.js API
// http://nightwatchjs.org/api

module.exports = {
  tags: ["itunes", "publish", "marketing", "signIn"],
  "iTunesConnect" : function (client) {
    client
      .resizeWindow(1024, 768)

      //============================================================================================
      .sectionBreak("A. MainPage")

      .url("http://localhost:3000")
      .waitForPage("#mainPage")
      .saveScreenshot("tests/nightwatch/screenshots/iTunesConnect/A-mainPage.png")

      //============================================================================================
      .sectionBreak("B. Marketing, Support, and Privacy")

      .url("http://localhost:3000/marketing")
      .waitForPage("#marketingPage")
      .saveScreenshot("tests/nightwatch/screenshots/iTunesConnect/B-marketingPage.png")

      .url("http://localhost:3000/support")
      .waitForPage("#supportPage")
      .saveScreenshot("tests/nightwatch/screenshots/iTunesConnect/B-supportPage.png")

      .url("http://localhost:3000/privacy")
      .waitForPage("#privacyPage")
      .saveScreenshot("tests/nightwatch/screenshots/iTunesConnect/B-privacyPage.png")

      .end();
  }
};
