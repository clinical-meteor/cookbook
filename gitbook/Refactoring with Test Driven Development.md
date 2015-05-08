## Refactoring with Test Driven Development
Refactoring test during test-driven-development is essentially the same as normal refactoring.  We're just moving code around between files and directories.



#### A)  Initial Steps
In both cases, we begin with a simple ``meteor create`` command, and then proceed to refactor to server/client architecture.


````js
// meteor create helloWorld
helloWorld/
  helloWorld.html
  helloWorld.css
  helloWorld.js

// refactor to server/client architecture
helloWorld/
  client/
    helloWorld.js
    helloWorld.html
    helloWorld.css
  server/
    methods.js
````


#### B1)  Tests In Same Repository (RTD, TinyTest, Mocha-Web)
The one major difference between regular coding, and coding for test-or-behavior-driven-development (TDD/BDD), is that we don't want to have our tests actually be served up in production.  We want to separate out our tests from production code.  So, we need to create a separate directory for our tests.

````js
// initial repository
helloWorld/
  client/
    helloWorld.js
    helloWorld.html
    helloWorld.css
  server/
    methods.js
  tests/
    helloTest.js
````

#### B2)  Tests In Separate Repository (TestHarness, Safety Harness)
However, we could also separate out our tests by putting them in an entirely different repository, and running them as a separate application altogether.
````js
// initial repository
helloWorld/
  client/
    helloWorld.js
    helloWorld.html
    helloWorld.css
  server/
    methods.js

// testharness repository
helloTests/
  helloTests.js
````




#### Z1)  Advanced Tests Within the Repository (RTD, TinyTest, Mocha-Web)
Our decision will affect how we later structure our code.  After a bit of time, we go to advanced topics, like stubbing and dependency injections.

````js
// initial repository
helloWorld/
  client/
    helloWorld/
      helloWorld.html
      helloWorld.js
      helloWorld.css
    niftyGizmo/
      niftyGizmo.html
      niftyGizmo.css
      niftyGizmo.js
  packages/
  server/
    methods.js
  tests/
    helloTestjs.js
    niftyGizmoTests.js
    /gizmo
      niftyGizmoStub.js
      niftyGizmoDependencyInjections.js
````

#### Z2)  Advanced Tests In Separate Repository (TestHarness, Safety Harness)
And we have the choice of having all those stubs and mock objects in our main application, or in a separate application.
````js
// initial repository
helloWorld/
  client/
    helloWorld/
      helloWorld.html
      helloWorld.js
      helloWorld.css
    niftyGizmo/
      niftyGizmo.html
      niftyGizmo.css
      niftyGizmo.js
  packages/
  server/
    methods.js

// testharness repository
helloTestjs/
  helloTestjs.js
  niftyGizmoTests.js
  niftyGizmo/
    niftyGizmoStub.js
    niftyGizmoDependencyInjections.js
````

