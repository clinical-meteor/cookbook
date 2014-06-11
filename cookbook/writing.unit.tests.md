## Writing Unit Tests  


#### Unit Tests  
Unlike acceptance tests, which treat your application as a black-box closed system, and only test inputs and outputs; unit testing treats your application as an open system, and has access to all the internals of your application.  As such, it needs a different kind of testing, called unit testing.


#### Running Tinytest

The simplest way to create unit tests is to use Tinytest, the native Meteor testing utility.  You'll need to add the ``tinytest`` package, and then use the custom ``mrt test-packages`` command.

````js
// create your application
meteor create helloworld
cd helloworld

// add the tinytest package
meteor add tinytest

// run your application
sudo mrt

// open a second browser and run the test packages
sudo mrt test-packages
````


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

