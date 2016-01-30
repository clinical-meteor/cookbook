##A/B Testing
=====================

https://www.optimizely.com  
https://www.uxcam.com  
https://lookback.io  



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
