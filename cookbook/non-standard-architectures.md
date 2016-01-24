Advanced Architectures  
=========================================

While popular, server/client architectures aren't the only way to build applications.  And since Meteor is really more about ecosystem and pipelining tools and isomorphic API interfaces, it turns out that Meteor can be run in a number of different architecture configurations. Including on the desktop and on mobile devices.   


============================================================
##### Desktop Apps: Electron (Chrome)

The first non-standard architecture you probably want to take a look at is using Meteor to create a desktop application, by way of Node Webkit and Chrome Extensions.  The basic idea is to launch a Blaze application from Node, but not send data over the wire.  To do that, you need a version of Node that uses Webkit and can render DOM.  Since Chrome uses the same V8 Javascript engine as Node; it was only a matter of time before somebody smashed Node and Chrome together to create a Desktop app.  That project is called [Electron](http://electron.atom.io/), and it's been ported to Meteor under a few different projects:

[Electrify](https://github.com/arboleya/electrify)
[Electron + Meteor Tutorial](https://medium.com/meteor-js/cross-platform-desktop-apps-with-meteor-and-electron-5355eb9e351#.pp579qw9nhttps://medium.com/meteor-js/cross-platform-desktop-apps-with-meteor-and-electron-5355eb9e351#.r8c14am23)
[Electrometer](https://github.com/sircharleswatson/Electrometeor)
[Electrometer Announcement](https://forums.meteor.com/t/electrometeor-desktop-applications-w-electron-meteor/3768)
[Demo: RocketChat](https://github.com/RocketChat/Rocket.Chat.Electron)
[meson:electron](https://github.com/electron-webapps/meteor-electron)

============================================================
##### Chrome Extensions

Sometimes, you don't need a full desktop app, but you want somthing a bit more tangible than just a webpage.  An intermediary architecture would be to use a Chrome Extension.  This lets you step outside of the browser window, but still be in a browser environment.  Useful for debugging tools, and the like.  

[Building A Chrome Extension Using Meteor](http://thebakery.io/blog/meteor-spotting-building-a-chrome-extension-using-meteor/)  


============================================================
##### Peer to Peer Architectures  

After getting Node to run Webkit, the next architecture of interest is to reverse the situation, and get Webkit to accept/host HTTP traffic and act like a server.  Basically, to make the Web Browser act like a server.  Turns out, there are some technologies to do that as well.    

[Could Node.js Run Client Side in Chrome?](http://stackoverflow.com/questions/5081191/could-node-js-run-client-side-in-chrome-with-its-native-client-to-be-released-s)  
  
[Node Browserfy](https://github.com/substack/node-browserify)    
  
