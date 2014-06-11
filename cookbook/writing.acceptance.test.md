## Writing Acceptance Tests  


#### Acceptance Tests Have 3 Essential Key Features
At it's most basic level, acceptance testing is essentially black-box testing, and is essentially concerned with testing inputs and outputs of a clossed system.  As such, there are three essential features to acceptance testing:  querying a resource, reading data, and writing data.  When it comes to browsers and webpages, these three features basically boil down to the following:  

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
It's very convenient to begin writing your acceptance tests by looking at the business use cases and regulatory obligations.  Behavior Driven Develop (BDD) is very convenient for this. The following example shows the process of converting a Business Feature into a use case and testing scenario using [http://docs.behat.org/guides/1.gherkin.html](Gherkin Script), a scripting language created by the Cucumber.js project.

````feature  
Feature: Player score can be increased manually

  As a score keeper in some hyperthetical game
  I want to manually give a player five points
  So that I can publicly display a up-to-date scoreboard

  Scenario: Give 5 points to a player
    Given I authenticate
    And "Grace Hopper" has a score of 10
    When I give "Grace Hopper" 5 points
    Then "Grace Hopper" has a score of 15
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
    And "Grace Hopper" has a score of 10
    When $("#niftyWidgetButton").click()
    foo = $("#niftyWidgetText").val()
    Then foo.should.have.value(20)
````
