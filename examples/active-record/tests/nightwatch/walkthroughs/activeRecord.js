// add tests to this file using the Nightwatch.js API
// http://nightwatchjs.org/api


var octocat = {
  title: "Octocat",
  url: "http://en.wikipedia.org/wiki/Octocat",
  imageUrl: "https://assets-cdn.github.com/images/modules/logos_page/Octocat.png",
  description: "Funnily enough, Oxley designed the octocat right around the same time as the Twitter bird, in 2006. GitHub wanted to use it for their logo, so they reached out to Oxley to bypass iStock rules and buy the rights to the Octocat directly. On Quora, GitHub co-founder PJ Hyett said, “Everybody seems to love the little guy. I’d be lying if I told you the thought of hiring someone to just do Octocat merchandising had never crossed my mind.” Oxley says he doesn’t clearly recollect creating the Octocat, but that he knows he used the head on another design, and copied and pasted it onto tentacles through Illustrator."
}
var helloCthulu = {
  title: "Hello Cthulu",
  url: "http://www.hello-cthulhu.com/",
  imageUrl: "http://ih1.redbubble.net/image.24129110.6086/fc,550x550,white.jpg",
  description: "Welcome to the beginning of Hello Cthulhu. This all started as a random idea I once had. I know that several people have come up with the same idea before me and have done a bit with it on the web and what not. But I'm pretty sure I'm the only one who has done a comic. In any case, I hope you enjoy these."
}

module.exports = {
  "FoosList Walkthrough" : function (client) {
    client
      .url("http://localhost:3000/list/foos")
      .resizeWindow(1024, 768)

      .reviewMainPanel()

      .sectionBreak('Reviewing Foo List Page')
      .reviewFoosListPage(false, false, false, true)
      .click("#noResultsMessage").pause(300)
      .waitForPage('#fooUpsertPage')

      .sectionBreak('Reviewing Foo Upsert Page')
      .reviewFooUpsertPage()

      .sectionBreak('Upserting Octocat Info')
      .upsertFooInfo('insert', octocat)

      .sectionBreak('Reviewing Octocat Info')
      .reviewFooUpsertPage(octocat)

      .sectionBreak('Upserting HelloCthulu Title')
      .upsertFooInfo('update', false, helloCthulu.title, false, false, false)
      .reviewFooUpsertPage(false, helloCthulu.title, octocat.url, octocat.imageUrl, octocat.description)

      .sectionBreak('Upserting HelloCthulu Info')
      .upsertFooInfo('update', helloCthulu)


      .sectionBreak('Reviewing HelloCthulu Info')
      .reviewFooUpsertPage(helloCthulu)

      .verify.elementPresent("#fooListButton")
      .verify.visible("#fooListButton")
      .moveToElement('#fooListButton', 10, 10)
      .click("#fooListButton").pause(500)
      //.waitForPage('#foosListPage')

      .sectionBreak('Reviewing Foo List Page')
      .reviewFoosListPage(helloCthulu.title, false, helloCthulu.description, false)

      // we've only added one new record; there shouldn't be a second (yet)!
      .verify.elementNotPresent("#foosUnorderedList li:nth-child(2)")
      .click("#foosUnorderedList li:nth-child(1)").pause(300)

      .sectionBreak('Removing Foo')
      .reviewFooUpsertPage(helloCthulu)
      .moveToElement('#removeFooButton', 10, 10)
      .click("#removeFooButton").pause(300)

      .sectionBreak('Foo List Should Be Empty')
      .reviewFoosListPage(false, false, false, true)

      .end();
  },

  "FooTable Walkthrough" : function (client) {
    client
      .url("http://localhost:3000/list/foos")
      .resizeWindow(1024, 768)
      .reviewMainPanel()


      .end();
  },

  "FooImageGrid Walkthrough" : function (client) {
    client
      .url("http://localhost:3000/list/foos")
      .resizeWindow(1024, 768)
      .reviewMainPanel()


      .end();
  }

};
