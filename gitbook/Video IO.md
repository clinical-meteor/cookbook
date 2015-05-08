## Video.IO

So, Video Input/Output can mean a couple different things. And they both revolve around the concept of [Double Buffering](http://en.wikipedia.org/wiki/Multiple_buffering).  Take an embedded YouTube video, as an example. There's the video stream which is served by YouTube and has a specific URL.  But then, the browser will combine that video with the page elements from the rest of the webpage, add some Chrome such as the URL bar, tabs, and window controls, and render a new video stream.  It's **that** second video stream that eventually gets rendered to your computer screen.


### Video Stream Buffers
There's also the OpenTok framework, which a few different groups have used to make video solutions with.
http://tokbox.com/opentok


### Browser Video Buffer
Watch these videos for the future of Meteor video.io.  Specifically, Newcomb talks about getAnimationFrame() functions as being the secret to getting 60fps DOM refresh rates.

  http://www.youtube.com/watch?v=83MX4wsoMzU
  https://www.youtube.com/watch?v=br1NhXeVD6Y
  https://www.youtube.com/watch?v=ixASZtHYGKY
  https://www.youtube.com/watch?v=zpebYhm8f2o
  https://www.youtube.com/watch?v=OhfI2wFNKFQ
