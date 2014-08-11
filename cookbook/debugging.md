Debugging
============================================


Both Chrome and Safari have built in debuggers.  With Chrome, all you have to do is right-click on a web page and 'Inspect Element'.  With Safari, you'll have to go into Preferences > Advanced and click on 'Show Develop menu in menu bar'.  With Firefox, you'll need to [install Firebug](https://getfirebug.com/)


============================================
#### Add Debugger Breakpoints to your App

You'll need to add ``debugger`` statements to your code:
````js
Meteor.methods({
  doSomethingUself: function(){
      debugger;
      niftyFunction();
  }})
````

============================================
#### Server Side Debugging with Node Inspector

For server side debugging, you'll need to use a tool like Node Inspector.  Before you get started, check out some of these useful tutorials.  

[HowToNode - Debugging with Node Inspector](http://howtonode.org/debugging-with-node-inspector)  
[Strongloop - Debugging with Node Inspector](http://docs.strongloop.com/display/DOC/Debugging+with+Node+Inspector)  
[NodeKnockout - Debugging with Node Inspector](http://blog.nodeknockout.com/post/34843655876/debugging-with-node-inspector)
[Oortcloud FAQ - How Do I Debug My Meteor App](https://github.com/oortcloud/unofficial-meteor-faq#how-do-i-debug-my-meteor-app)
]

tl;dr - there are a number of utilities in the Meteor ecosystem which are designed to be run at the same time as your Meteor application.  They only work if your Meteor app is up and running and they can connect to a running website.  ``meteor mongo``, Robomongo, Nightwatch, Node Inspector... these are all utilities that need your application to already be running.  

````sh
# install node-inspector
terminal-a$  npm install -g node-inspector

# start meteor
terminal-a$  NODE_OPTIONS='--debug-brk --debug' mrt run

# alternatively, some people report this syntax being better
terminal-a$  sudo NODE_OPTIONS='--debug' ROOT_URL=http://myapp.com meteor --port 80

# launch node-inspector along side your running app
terminal-b$  node-inspector

# go to the URL given by node-inspector
http://localhost:8080/debug?port=5858
````

[Walkthrough with Screenshots of Using Node Inspector with Meteor](https://github.com/meteor/meteor/issues/1411)  


============================================
#### Server Side Debugging with npm debug  

Besides Node Inspector, some people have reported success with a npm utility called ``debug``.  
[MeteorHacks - Debugging Meteor with npm debug](http://meteorhacks.com/debugging-meteor-packages-and-apps.html)  

