**Q:  Is it possible to write a peer-to-peer app with Meteor?**  

Interesting question.  Writing peer-to-peer apps involves putting the client and the server on the same box; which seems like it might be a natural fit for a single-language framework like Meteor.  Basically, it would involve running the browser on the server; or running a server out of the browser.  How would one go about doing that?  Well, the best bet would be a Node/Chrome solution, since they both use the V8 javascript engine.  After that, it becomes a question of running a browser from Node (PhantomJS as an example); or of running Node from the browser.. meaning from Chrome.  So, looking around, it looks like there are, indeed, such packages.  

Could Node.js Run Client Side in Chrome?  
http://stackoverflow.com/questions/5081191/could-node-js-run-client-side-in-chrome-with-its-native-client-to-be-released-s  

Node Webkit  
https://github.com/rogerwang/node-webkit  

Node Chromify  
https://github.com/iceddev/node-chromify  

NodeJS in Chrome Packaged Apps  
http://www.youtube.com/watch?v=gkb_x9ZN0Vo&feature=youtube_gdata_player  

Node Browserfy
https://github.com/substack/node-browserify

**Q:  How do I enable/disable websockets?**  
lorem ipsum...


**Q:  How do I know if RTC is working?**  
lorem ipsum...
