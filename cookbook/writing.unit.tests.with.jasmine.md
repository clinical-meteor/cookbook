## Writing Unit Tests with Jasmine and Velocity


#### Unit Tests  
Unlike acceptance tests, which treat your application as a black-box closed system, and only test inputs and outputs; unit testing treats your application as an open system, and has access to all the internals of your application.  As such, it needs a different kind of testing, called unit testing.


#### Running Jasmine with Velocity

The simplest way to create unit tests is to use Tinytest, the native Meteor testing utility.  (Tinytest is not to be confused with TinyTestJS, which is a different library).  You'll need to add the ``tinytest`` package, and then use the custom ``mrt test-packages`` command.

````js
// create your application
meteor create helloworld
cd helloworld

// install velocity and reporters
mrt add velocity
mrt add velocity-html-reporter
mrt add moment

// install jasmine-unit
mrt add jasmine-unit

// run your application
sudo mrt
````

#### Jasmien API  

Tinytest supports the following test syntax.  

- test.equal(actual, expected, message, not)  
- test.notEqual(actual, expected, message)  
- test.instanceOf(obj, klass)  
- test.matches(actual, regexp, message)  
- test.isTrue(actual, msg)  
- test.isFalse(actual, msg)  
- test.isNull(actual, msg)  
- test.isNotNull(actual, msg)  
- test.isUndefined(actual, msg)  
- test.isNaN(actual, msg)  
- test.isUndefined(actual, msg)  
- test.length(obj, expected_length, msg)  

#### Creating a Tinytest Package for Testing In-App Files

Tinytest is designed to encourage application modularity, and runs as part of the package framework.  To use it, you'll need to create a package for your application that contains your unit tests.  Start by creating a directory for your tests in the ``packages/`` directory, and then creating a ``package.js`` file in it.

````sh
cd packages
mkdir leaderboard-tinytests
nano packages/leaderboard-tinytests/packages.js
````

Within the ``package.js`` file, you'll want to specify a ``Package.on_test`` directive, within which you'll define dependencies, stub functions, links to the libraries you want to test, and the unit tests themselves.

````js
// leaderboard/packages/leaderboard-tinytests/packages.js

Package.describe({ summary: "Provides unit tests for leaderboard application." });

Package.on_test(function (api) {
  // add package dependencies
  api.use(["spacebars", "tinytest", "test-helpers"]);

  // in particular, you'll probably want to use the 'templating' package for any UI related tests
  api.use("templating", "client");

  // add stubs
  api.add_files('test-stubs.js', 'client');

  // reference the application files you want to test
  api.add_files('../../leaderboard.js', 'client');

  // and link to the unit tests for them
  api.add_files('leaderboard-tests.js', 'client');
});
````

#### Add Stubs

The trick with unit testing is understanding that you're trying to test *your* code, and not other people's code.  Ideally, you want to define empty functions for all of the external libraries and API calls that you use in your application.  We call these empty functions 'stubs'.  Once defined, they'll allow the Javascript interpreter to read and compile your code, but will also allow you to look behind the curtain at what's going on backstage.  

Stub functions look like the following:

````js
// leaderboard/packages/leaderboard-tinytests/test-stubs.js

Template = {
  leaderboard: {
    events: function(){ return; },
    fireEvent: function(){ return; }
  },
  player: {
    events: function(){ return; },
    addContextAttribute: function(){ return; },
    fireEvent: function(){ return; }
  }
};

Players = {};
````

#### Write Your Unit Tests  
Once you have your unit tests in place, you can begin writing actual unit tests.

````js
(function () {
    "use strict";

    jasmine.DEFAULT_TIMEOUT_INTERVAL = jasmine.getEnv().defaultTimeoutInterval = 20000;

    describe("Template.leaderboard.players", function () {

        it("asks for the players to be primarily in descending score order, then in alphabetical order and returns as is", function () {
            var someLocalCollectionCursor = {};
            Players.find = function (selector, options) {
                expect(options.sort.score).toBe(-1);
                expect(options.sort.name).toBe(1);
                return someLocalCollectionCursor;
            };
//            expect(Template.leaderboard.players()).toBe(null);
            expect(Template.leaderboard.players()).toBe(someLocalCollectionCursor);
        });
    });

    describe("Template.leaderboard.selected_name", function () {

        it("returns player when player is found and has a name", function () {
            Players.findOne = function () {
                return {name: 'Tom'};
            };
            expect(Template.leaderboard.selected_name()).toBe('Tom');
        });

        it("returns undefined when player.name isn't present", function () {
            Players.findOne = function () {
                return {};
            };
            expect(Template.leaderboard.selected_name()).toBe(undefined);
        });

        it("returns undefined when player doesn't exist", function () {
            Players.findOne = function () {
                return undefined;
            };
            expect(Template.leaderboard.selected_name()).toBe(undefined);
        });

    });

    describe("Template.player.selected", function () {

        it("returns selected when the selected player in the session matches player in the current template", function () {
            Template.player._id = 1234;
            Session.set('selected_player', 1234);
            expect(Template.player.selected()).toBe('selected');
        });

        it("returns empty string when the selected player in the session doesn't matches player in the current template", function () {
            Template.player._id = 4321;
            Session.set('selected_player', 1234);
            expect(Template.player.selected()).toBe('');
        });

    });

    describe("Template.leaderboard [click input.inc] event", function () {

        it("updates the player score by 5 when input.inc is clicked", function () {
            Session.set('selected_player', 1234);
            Players.update = function (selector, options) {
                expect(selector).toBe(1234);
                expect(options.$inc.score).toBe(5);
            };
            Template.leaderboard.fireEvent('click input.inc');
        });

    });

    describe("Template.player [click] event", function () {

        it("clicking a player sets them to the selected player in the session", function () {
            Template.player.addContextAttribute('_id', 888);
            Template.player.fireEvent('click');
            expect(Session.get("selected_player")).toBe(888);
        });

    });
})();
````

#### Leaderboard Example  

You can find a complete example of Jasmine unit tests for the Leaderboard example at the following [leaderboard-jasmine](https://github.com/xolvio/velocity-example) repository.



