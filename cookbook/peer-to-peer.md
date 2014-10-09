Non Server-Client Architectures  
=========================================

While popular, server/client architectures aren't the only way to build applications.  And since Meteor is really more about ecosystem and pipelining tools and isomorphic API interfaces, it turns out that Meteor can be run in a number of different architecture configurations.  


============================================================
##### Desktop & Command Line Architectures

The first non-standard architecture you probably want to take a look at is using Meteor to create a desktop application, by way of Node Webkit and Chrome Extensions.  The basic idea is to launch a Blaze application from Node, but not send data over the wire.  To do that, you need a version of Node that uses Webkit and can render DOM.  In practice, Google has dubbed this technology "Chrome".  


[Node Webkit](https://github.com/rogerwang/node-webkit)  

[Building A Chrome Extension Using Meteor](http://thebakery.io/blog/meteor-spotting-building-a-chrome-extension-using-meteor/)  

[Node Chromify](https://github.com/iceddev/node-chromify)    

[NodeJS in Chrome Packaged Apps](http://www.youtube.com/watch?v=gkb_x9ZN0Vo&feature=youtube_gdata_player)    
  


============================================================
##### Peer to Peer Architectures  

After getting Node to run Webkit, the next architecture of interest is to reverse the situation, and get Webkit to accept/host HTTP traffic and act like a server.  Basically, to make the Web Browser act like a server.  Turns out, there are some technologies to do that as well.    

[Could Node.js Run Client Side in Chrome?](http://stackoverflow.com/questions/5081191/could-node-js-run-client-side-in-chrome-with-its-native-client-to-be-released-s)  
  
[Node Browserfy](https://github.com/substack/node-browserify)    
  
