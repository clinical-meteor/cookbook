## Refactoring Process
The following is a brief outline of the process of refactoring.  If you're an experienced programmer, this will be second-nature to you already.  But it's useful to write them down sometimes so people can refer to them, particularly during design discussions.  

If you're only recently finding yourself writting larger programs that need refactoring, I hope this little reference gives you an overview of what refactoring feels like.  


#### Step 1:  meteor create helloWorld
````
helloWorld/
  helloWorld.html
  helloWorld.css
  helloWorld.js
````

#### Step 2:  Refactor to Server/Client 
````
helloWorld/
  client/
    helloWorld.js
    helloWorld.html
    helloWorld.css
  server/
    methods.js
````

#### Separate our Model, View, and Controller into separate folders
````
helloWorld/
  client/
    html/
      helloWorld.html  
    js
      helloWorld.js
    css      
      helloWorld.css
  server/
    methods.js
````

#### Add new Widgets and Gizmos
````
helloWorld/
  client/
    html/
      helloWorld.html  
      coolWidget.html  
      niftyGizmo.html  
    js
      helloWorld.js
      coolWidget.js  
      niftyGizmo.js
    css      
      helloWorld.css
      coolWidget.css  
      niftyGizmo.css
  server/
    methods.js
````

#### Reorganize According to Workflow or Features
````
helloWorld/
  client/
    helloWorld/
      helloWorld.html  
      helloWorld.js
      helloWorld.css
    coolWidget/
      coolWidget.html  
      coolWidget.js  
      coolWidget.css  
    niftyGizmo/
      niftyGizmo.html
      niftyGizmo.css
      niftyGizmo.js
  packages/
  server/
    methods.js
````

#### Extract and Modularize a Feature 
````
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
    coolWidget/
      coolWidget.html  
      coolWidget.js  
      coolWidget.css  
  server/
    methods.js
````

#### Prepare it for Publications
````
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
    coolWidget/
      coolWidget.html  
      coolWidget.js  
      coolWidget.css  
      package.js
      smart.json
  server/
    methods.js
````

#### Publish the Feature
````
coolWidget/
  coolWidget.html  
  coolWidget.js  
  coolWidget.css  
  package.js
  smart.json
````


#### Code is Now Cleaner and More Modular
````
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
````

