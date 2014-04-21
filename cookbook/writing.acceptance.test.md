## Writing Acceptance Tests  

#### Business Use Cases and Regulatory Requirements  
It's very convenient to begin writing your acceptance tests by looking at the business use cases and regulatory obligations.  Behavior Driven Develop (BDD) is very convenient for this.  As is writing Use Case Stories and Scenarios.  The following is an example of converting a Business Feature into a use case and testing scenario.  

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

#### Acceptance Tests Have 3 Essential Key Features
Be aware that most all acceptance testing can be boiled down to three essential features:  querying a resource, reading data, and writing data.  When it comes to browsers and webpages, these three features basically boil down to the following:  

1.  Load a page  
2.  Inspect DOM elements  
3.  Trigger an event / simulate a user interaction  


Which, when translated to JQuery (and a bit of Chai), look something like this:
````js
  $(window).open("http://leaderboard.meteor.com");
  $('#niftyWidgetButton').click();
  $('#niftyWidgetText').val().should.have.value(20);
````  

Sometimes, you'll want to adjust the timing of your tests, which is easily done by setting timeouts (in milliseconds).  
````js
  $(window).open("http://leaderboard.meteor.com");
  setTimeout(function(){
    $('#niftyWidgetButton').click();
  }, 200);
  setTimeout(function(){
    $('#niftyWidgetText').val().should.have.value(20);
  }, 500);
````  
