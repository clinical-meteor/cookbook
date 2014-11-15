## Refactoring Process
The following is a brief outline of the process of refactoring.  If you're an experienced programmer, this will be second-nature to you already.  If you're only recently finding yourself writting larger programs that need refactoring, I hope this little reference gives you an overview of what refactoring feels like.  


#### A)  meteor create helloWorld
Create your app by running ``meteor create helloWorld`` at the command prompt.  
````
helloWorld/
  helloWorld.html
  helloWorld.css
  helloWorld.js
````


#### B)  Refactor to Server/Client 
Add server/client functionality, by create a ``/client`` and ``/server`` directory, and moving the contents of ``Meteor.isClient()`` into the ``/client`` directory, and the contents of ``Meteor.isServer()`` into the ``/server`` directory.  
````
helloWorld/
  client/
    helloWorld.js
    helloWorld.html
    helloWorld.css
  server/
    methods.js
````

#### C)  Separate our Model, View, and Controller into separate folders
This step is optional, but as your app is growing, it's likely that at some point you're going to need to define your Models, Views, and Controllers.  And unless you're very experienced, have done many wireframes, and have a very clear idea of what you want your app to do, it's likely that it's not going to be exactly clear how to divide up code responsibility into different files and modules.    

Now then, there's lots of approaches to doing MVC, but it's important to mention that there are two common patterns you should be aware of:  server-side MVC, and client-side MVC.  

````js
// server-side MVC pattern, was popularized by frameworks like Ruby, Angular, and Ember
helloWorld/          // the encapsulating folder is considered the View
  helloWorld.html    // the HTML is consdered the Model/View
  helloWorld.js      // the Javascript is the Model/Controller
  // helloWorld.css  // the CSS is generlaly ignored as 'just styling'

// client-side MVC pattern was popularized by traditional desktop apps, and is similar to .Net and Flash
helloWorld/         // the encapsulating folder is considered the Scene or Workflow Component
  helloWorld.html   // the HTML is the Model
  helloWorld.js     // the Javascript is the Controller
  helloWorld.css    // the CSS is the View

````

In my experience, I find that at this early stage, I often don't know how I want to organize my code, so it's easiest to group things according to file type.  

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
And usually, I go a step further, and rename the directories to Model, View, Controller, using a client-side MVC pattern.

````
helloWorld/
  client/
    model/
      helloWorld.html  
    controller
      helloWorld.js
    view      
      helloWorld.css
  server/
    methods.js
````

#### D)  Add new Widgets and Gizmos
At some point, new libraries and files are added to the project.  Until some clear workflow or scenes are established, it's often helpful to simply group by file types.  

````
helloWorld/
  client/
    model/
      helloWorld.html  
      coolWidget.html  
      niftyGizmo.html  
    controller
      helloWorld.js
      coolWidget.js  
      niftyGizmo.js
    view      
      helloWorld.css
      coolWidget.css  
      niftyGizmo.css
  server/
    methods.js
````

#### E)  Reorganize According to Workflow or Features
At some point, you'll find that a scene or piece of workflow is coming together well, and you'll want to extract it and modularize it.  A ``workflows`` directory that coincides with the ``packages`` directory is useful to have around.  In the following example, we've refactored the ``coolWidget`` files into their own directory.  
````
helloWorld/  
  client/  
    model/  
      helloWorld.html  
      niftyGizmo.html  
    controller/  
      helloWorld.js
      niftyGizmo.js
    view/     
      helloWorld.css
      niftyGizmo.css
    workflows/  
      coolWidget/  
        coolWidget.html  
        coolWidget.js  
        coolWidget.css  
  packages/
  server/
    methods.js
````

This can continue until everything has been refactored.
````
helloWorld/  
  client/  
    model/  
    controller/  
    view/     
    workflows/  
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
        niftyGizmo.js  
        niftyGizmo.css  
  packages/
  server/
    methods.js
````

#### F)  Extract and Modularize a Feature 
The next step, of course, is to extract a workflow scene or widget into a package.  This simply involves moving files between folders.  
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

#### G)  Prepare it for Publications  
And then adding the necessary ``package.js`` file to publish it.  
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
  server/
    methods.js
````

#### H)  Publish the Feature
At which point, a unit of functionality has been modularized and refactored out of our application into it's own package.   Notice how the basic MVC structure of the package mirrors the structure of the Meteor app after we ran ``meteor create helloWorld``.  
````
coolWidget/
  coolWidget.html  
  coolWidget.js  
  coolWidget.css  
  package.js
````


#### I)  Code is Now Cleaner and More Modular
And when we go back to our app, our overall code is cleaner and more concise, and easy to maintain and reason about.  
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
  server/
    methods.js
````

