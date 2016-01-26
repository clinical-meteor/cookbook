## WebRTC

So, Video Input/Output can mean a couple different things. And they both revolve around the concept of [Double Buffering](http://en.wikipedia.org/wiki/Multiple_buffering).  Take an embedded YouTube video, as an example. There's the video stream which is served by YouTube and has a specific URL.  But then, the browser will combine that video with the page elements from the rest of the webpage, add some Chrome such as the URL bar, tabs, and window controls, and render a new video stream.  It's **that** second video stream that eventually gets rendered to your computer screen.  

======================================
#### Video Stream Buffers  
There's also the OpenTok framework, which a few different groups have used to make video solutions with.  
http://tokbox.com/opentok

======================================
#### WebRTC Examples

http://www.mhurwi.com/a-basic-webrtc-tutorial-using-meteor-peerjs/
https://webrtc-signalling.meteor.com/liw
https://github.com/foxdog-studios/meteor-webrtc
https://groups.google.com/forum/#!topic/easyrtc/XZj8fUqhbXQ
https://atmospherejs.com/fds/webrtc
https://atmospherejs.com/fds/webrtc?q=webrtc
https://crosswalk-project.org/documentation/webrtc.html
