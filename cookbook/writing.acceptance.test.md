## Writing Acceptance Tests  


#### Acceptance Tests Have 3 Essential Key Features
At it's most basic level, acceptance testing is essentially black-box testing, which is fundamentally concerned with testing inputs and outputs of a closed system.  As such, there are three essential features to acceptance testing:  locating a resource, reading data, and writing data.  When it comes to browsers and webapps, these three features basically boil down to the following:  

1.  Load a webpage or application view
2.  Inspect user interface elements (i.e. DOM)  
3.  Trigger an event / simulate a user interaction  


Which, when translated to JQuery (and a bit of Chai), look something like this:
````js
  // some type of call to open a URL (the Closed System)
  $(window).open("http://leaderboard.meteor.com");  
  
  // some way to inspect the value of an element in the DOM (the Output)
  $('#niftyWidgetText').val().should.have.value(20);

  // some way to specify user interactions and inputs (the Input)
  $('#niftyWidgetButton').click();
````  


#### Business Use Cases and Regulatory Requirements  
It's very convenient to begin writing your acceptance tests by looking at the business use cases and regulatory obligations.  Behavior Driven Develop (BDD) is very convenient for this. The following example shows the process of converting a Business Feature into a use case and testing scenario using [Gherkin Script](http://docs.behat.org/guides/1.gherkin.html), a scripting language created by the Cucumber.js project.

````feature  
Feature: Player score can be increased manually

  As a score keeper in some hyperthetical game
  I want to manually give a player five points
  So that I can publicly display a up-to-date scoreboard

  Scenario: Give 5 points to a player
    Given I authenticate
    And "Grace Hopper" has a score of 40
    When I give "Grace Hopper" 5 points
    Then "Grace Hopper" has a score of 45
````


#### Converting Use Cases into Tests  
Once you have your features, use cases, and scearios defined, begin translating them into acceptance tests, using CoffeeScript, jQuery, and Behavior Driven Development libraries, such as Chai. 

````feature  
Feature: Player score can be increased manually

  As a score keeper in some hyperthetical game
  I want to manually give a player five points
  So that I can publicly display a up-to-date scoreboard

  Scenario: Give 5 points to a player
    Given I can connect to page "http://leaderboard.meteor.com"
    And $('div.leaderboard div:nth-child(2) .score').val === 40
    When $("input.inc").click()
    Then $('div.leaderboard div:nth-child(2) .score').val === 45
````

Eventually, you'll need to decide whether you want to go through the effor of stubing And, When, and Then functions, and doing all the extra programming to maintain the Gherkin business level syntax for your acceptance tests.


#### Installing and Running Nightwatch  

The simplist interface for getting Meteor up and running with acceptance testing using a browser automation server, is to use the Nightwatch bridge to Selenium.  You install [selenium-nightwatch](http://github.com/awatson1978/selenium-nightwatch.git) by simply running ``starrynight generate-autoconfig && starrynight scaffold --framework nightwatch`` in your application directory, and then using the [Nightwatch API](http://nightwatchjs.org/api) to write acceptance tests.  

````sh
# Go to the root of your application
terminal-a$  cd myappdir
terminal-a$ meteor

# Option A:  Install via Npm
terminal-b$  npm install starrynight  
terminal-b$  starrynight generate-autoconfig
terminal-b$  starrynight scaffold --framework nightwatch

# and then, in the same way that we run 'meteor mongo' in a separate terminal
terminal-b$  starrynight run-tests --framework nightwatch
````

#### Writing Acceptance Tests  

Ultimately, just like writing application code, you'll need to figure out what kind of tests are right for you, your tolerance for ease of installation, and whether you can tolerate acceptance tests written in code, pseudocode, or need domain specific business langauge.  But for getting up to speed quickly, Nightwatch can be installed inside of 5 minutes to a project, and lets you get acceptance test coverage of your application at an extremely rapid pace.


Once Nightwatch is installed, simply create a file in the ``tests/nightwatch`` directory (it doesn't matter what the name is), add the following code, and run ``starrynight run-tests --framework nightwatch`` from the command line.  
````js
// tests/leaderboard-walkthrough.js
module.exports = {
  "Hello World" : function (client) {
    client
      .url("http://127.0.0.1:3000")
      .waitForElementVisible("body", 1000)
      .assert.title("Leaderboard")
      .end();
  }
};
````

You should be up and running!

####  Writing More Complicated Acceptance Tests

Once you have your first test running green, check out the [Nightwatch API](http://nightwatchjs.org/api#assert-attributeEquals), and start creating more advanced tests, like this leaderboard test:

````js
module.exports = {
  "Hello World" : function (browser) {
    browser
    .url("http://localhost:3000")
    .waitForElementVisible('body', 1000)
    .waitForElementVisible('div#outer', 1000)
    .waitForElementVisible('div.leaderboard', 1000)
    .waitForElementVisible('.leaderboard .player', 1000)

    .verify.containsText('div.leaderboard div:nth-child(1) .name', 'Ada Lovelace')
    .verify.containsText('div.leaderboard div:nth-child(1) .score', '50')

    .verify.containsText('div.leaderboard div:nth-child(2) .name', 'Grace Hopper')
    .verify.containsText('div.leaderboard div:nth-child(2) .score', '40')

    .verify.containsText('div.leaderboard div:nth-child(3) .name', 'Claude Shannon')
    .verify.containsText('div.leaderboard div:nth-child(3) .score', '35')

    .verify.containsText('div.leaderboard div:nth-child(4) .name', 'Nikola Tesla')
    .verify.containsText('div.leaderboard div:nth-child(4) .score', '25')

    .verify.containsText('div.leaderboard div:nth-child(5) .name', 'Marie Curie')
    .verify.containsText('div.leaderboard div:nth-child(5) .score', '20')

    .verify.containsText('div.leaderboard div:nth-child(6) .name', 'Carl Friedrich Gauss')
    .verify.containsText('div.leaderboard div:nth-child(6) .score', '5')


    .verify.containsText('.none', 'Click a player to select')
    .click('div.leaderboard div:nth-child(2)')
    .pause(500)
    .waitForElementVisible('input.inc', 1000)
    .verify.attributeEquals('input.inc', 'value', 'Give 5 points')

    .click('input.inc')
    .verify.containsText('div.leaderboard div:nth-child(2) .name', 'Grace Hopper')
    .verify.containsText('div.leaderboard div:nth-child(2) .score', '45')

    .click('input.inc')
    .verify.containsText('div.leaderboard div:nth-child(2) .name', 'Grace Hopper')
    .verify.containsText('div.leaderboard div:nth-child(2) .score', '50')

    .click('input.inc')
    .verify.containsText('div.leaderboard div:nth-child(1) .name', 'Grace Hopper')
    .verify.containsText('div.leaderboard div:nth-child(1) .score', '55')

    .verify.containsText('div.leaderboard div:nth-child(2) .name', 'Ada Lovelace')
    .verify.containsText('div.leaderboard div:nth-child(2) .score', '50')

    //.setValue('input[type=text]', 'nightwatch')

    .end();
  }
};
````

#### Leaderboard Example  

You can find a complete example of acceptance tests for the Leaderboard example at the following [leaderboard-nightwatch](https://github.com/awatson1978/leaderboard-nightwatch) repository.



