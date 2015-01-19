## Writing Unit Tests with Jasmine and Velocity


#### Unit Tests

Unlike acceptance tests, which treat your application as a black-box closed system, and only test inputs and outputs; unit testing treats your application as an open system, and has access to all the internals of your application.  As such, it needs a different kind of testing, called unit testing.

The simplest way to create unit tests is to use Tinytest, the native Meteor testing utility.  
See [Writing Unit Tests with TinyTest for details](/cookbook/writing.unit.tests.md) for details.

#### Running Jasmine with Velocity

````js
// create your application
meteor create leaderboard
cd leaderboard

// install velocity and reporters
meteor add velocity:core
meteor add velocity:html-reporter
meteor add momentjs:moment

// install jasmine-unit
meteor add sanjo:jasmine

// run your application
sudo meteor
````

#### Jasmine API  

Find the complete Jasmine API here:  [http://jasmine.github.io/](http://jasmine.github.io/)

````js
// expect() syntax 
expect(foo).toBe(bar);
expect(foo).not.toBe(null);
expect(a.foo).toBeDefined();
expect(a.bar).not.toBeDefined();
expect(null).toBeNull();
expect(foo).toBeNull();
expect(foo).not.toBeNull();
expect(foo).toBeTruthy();
expect(a).toBeFalsy();
expect(a).toContain("bar");
expect(a).not.toContain("quux");
expect(e).toBeLessThan(pi);
expect(pi).not.toBeLessThan(e);
expect(pi).toBeGreaterThan(e);
expect(foo).toEqual(1);

// spyOn() syntax   
spyOn(Players, 'find').and.returnValue(cursor);
````


#### Add Stubs

The trick with unit testing is understanding that you're trying to test *your* code, and not other people's code.  Ideally, you want to define empty functions for all of the external libraries and API calls that you use in your application.  We call these empty functions 'stubs'.  Once defined, they'll allow the Javascript interpreter to read and compile your code, but will also allow you to look behind the curtain at what's going on backstage.  

````js
// add the following stub functions
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
Once you have your stubs in place, you can begin writing actual unit tests.

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



