// add tests to this file using the Nightwatch.js API
// http://nightwatchjs.org/api


var octocat = {
  username: "octocat",
  password: "octocat",
  emails: [{address: "octocat@test.com"}],
  profile: {
    fullName: "Octocat",
    avatar: "https://assets-cdn.github.com/images/modules/logos_page/Octocat.png",
    description: "Funnily enough, Oxley designed the octocat right around the same time as the Twitter bird, in 2006. GitHub wanted to use it for their logo, so they reached out to Oxley to bypass iStock rules and buy the rights to the Octocat directly. On Quora, GitHub co-founder PJ Hyett said, “Everybody seems to love the little guy. I’d be lying if I told you the thought of hiring someone to just do Octocat merchandising had never crossed my mind.” Oxley says he doesn’t clearly recollect creating the Octocat, but that he knows he used the head on another design, and copied and pasted it onto tentacles through Illustrator."
  }
}
var helloCthulu = {
  username: "hellocthulu",
  password: "hellocthulu",
  emails: [{address: "hellocthulu@test.com"}],
  profile: {
    fullName: "Hello Cthulu",
    avatar: "http://ih1.redbubble.net/image.24129110.6086/fc,550x550,white.jpg",
    description: "Welcome to the beginning of Hello Cthulhu. This all started as a random idea I once had. I know that several people have come up with the same idea before me and have done a bit with it on the web and what not. But I'm pretty sure I'm the only one who has done a comic. In any case, I hope you enjoy these."
  }
}
var editedOctocat = octocat;
editedOctocat.profile.fullName = helloCthulu.profile.fullName;


module.exports = {
  tags: ['users', 'validation', 'client'],
  before: function(client){
    // this depends on the accounts-housemd package
    client
      .url("http://localhost:3000")
      .meteorCall("removeAllUsers", false, false)
      .pause(500)
  },
  "Users List Walkthrough" : function (client) {

    var newUserId = false;

    client
      .url("http://localhost:3000/list/users")
      .resizeWindow(1024, 768)

      .reviewMainPanel()

      .sectionBreak('Reviewing User List Page')
      .reviewUsersListPage(false, false, true)
      .moveToElement('#userNavFooter', 10, 10)
      .click(".addUserIcon").pause(300)
      .waitForPage('#userUpsertPage')

      .sectionBreak('Reviewing User Upsert Page')
      .reviewUserUpsertPage()

      .sectionBreak('Upserting Octocat Info')
      .upsertUser('insert', octocat).pause(1000)

      .sectionBreak('Reviewing Octocat Info')
      .reviewUserUpsertPage(octocat)
      .checkUserRecord(newUserId, false, function(error, record){
        client.assert.ok(record);
      })

      .sectionBreak('Upserting HelloCthulu Title')
      .upsertUser('update', {profile:{fullName: helloCthulu.profile.fullName}})
      .reviewUserUpsertPage(false, editedOctocat)

      .sectionBreak('Upserting HelloCthulu Info')
      .upsertUser('update', helloCthulu)


      .sectionBreak('Reviewing HelloCthulu Info')
      .reviewUserUpsertPage(helloCthulu)

      .verify.elementPresent("#userListButton")
      .verify.visible("#userListButton")
      .moveToElement('#userListButton', 10, 10)
      .click("#userListButton").pause(500)
      //.waitForPage('#usersListPage')

      .sectionBreak('Reviewing User List Page')
      .reviewUsersListPage(helloCthulu, false, false)

      // we've only added one new user; there shouldn't be a second (yet)!
      .verify.elementNotPresent("#usersUnorderedList li:nth-child(2)")
      .click("#usersUnorderedList li:nth-child(1)").pause(300)

      .sectionBreak('Removing User')
      .reviewUserUpsertPage(helloCthulu)
      .moveToElement('#removeUserButton', 10, 10)
      .click("#removeUserButton").pause(300)

      .sectionBreak('User List Should Be Empty')
      .reviewUsersListPage(false, false, false, true)

      .end();
  },

  "Users Table Walkthrough" : function (client) {
    client
      .url("http://localhost:3000/table/users")
      .resizeWindow(1024, 768)
      .reviewMainPanel()

      .end();
  },

  "Users Image Grid Walkthrough" : function (client) {
    client
      .url("http://localhost:3000/list/users")
      .resizeWindow(1024, 768)
      .reviewMainPanel()

      .end();
  }

};
