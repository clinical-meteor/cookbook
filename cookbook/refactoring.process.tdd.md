## Refactoring Test Driven Development
The following is a brief outline of the process of refactoring.  If you're an experienced programmer, this will be second-nature to you already.  But it's useful to write them down sometimes so people can refer to them, particularly during design discussions.  

If you're only recently finding yourself writting larger programs that need refactoring, I hope this little reference gives you an overview of what refactoring feels like.  


#### A)  meteor create helloWorld
````js
// initial repository
helloWorld/
  helloWorld.html
  helloWorld.css
  helloWorld.js
````

#### B)  Refactor to Server/Client 
````js
// initial repository
helloWorld/
  client/
    helloWorld.js
    helloWorld.html
    helloWorld.css
  server/
    methods.js
````

#### B1)  Tests Within the Repository (RTD)
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

#### B2)  Tests In Separate Repository (Safety Harness)
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





#### Z1)  Advanced Tests Within the Repository (RTD)
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

#### Z2)  Advanced Tests In Separate Repository (Safety Harness)
````
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
  /gizmo
    niftyGizmoStub.js
    niftyGizmoDependencyInjections.js
````
