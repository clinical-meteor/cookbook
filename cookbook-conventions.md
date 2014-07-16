## Cookbook MVC Conventions


Before diving into the Meteor Cookbook, we should have a short discussion about what people mean when they talk about 'MVC', since the Cookbook makes some opinionated choice about how to treat MVC. In particular, it avoids server-side Ruby and Angular MVC patterns, which treat a View as a collection of HTML and Javascript, and tends towards an old-school thick-client use of the term MVC.  

What do we mean by 'old school'?  Well, a little background to put this into context.  In the 1970s, Xerox PARC developed the first mouse interface and first GUI.  They used a Model-View-Controller paradigm, which was copied and experimented with throughout most of the 1980s by Apple, SGI, Sun, and all the other computer tech companies of the era.  MVC was fairly well understood during those days, although there was quite a bit of experimenting with alternative architectures, such as [Presentation-Abstraction-Control(PAC)](http://en.wikipedia.org/wiki/Presentation-abstraction-control), [Hierarchical Model-View-Controller(HMVC)](http://en.wikipedia.org/wiki/Hierarchical_model%E2%80%93view%E2%80%93controller), and [Model-View-Presenter (MVP)](http://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93presenter).  But most all of them wound up having something like the following flow:

![MVC History](https://raw.githubusercontent.com/awatson1978/meteor-cookbook/master/images/MVC%20Cycle%20-%20Traditional%20Model.jpg)


Then, in the 1990s, the Web came onto the scene, and people started building server-client applications. This caused a big schism in how people understood the MVC model.  The computers that people sat at were no longer dumb terminals, but computers in their own regard.  And we started having to develop concepts around server-client MVC patterns.    

![Basic Server-Client Technologies](https://raw.githubusercontent.com/awatson1978/meteor-cookbook/master/images/Static%20Website%20Architecture%20-%20Before%20Loading%20Page.jpg)  

After a few years of experimenting, a common trend emerged where JS, HTML, and CSS files resent from the server to the client, and the HTML gets rendered to the DOM, which then gets CSS applied to it in the render tree, which gets javascript applied to it, which all gets shipped to the graphics buffer and displayed on the device screen.

This approach developed in large part because the client-side developers were using the same MVC and PAC models from pre-internet days to build the first web browsers.  And, along the way, those concepts of Model/View/Controller or Presentation/Abstraction/Controller got turned into the domain languages that we know now as Hypertext Markup Language, Cascading Style Sheets, and Javascript.  Or rather, hypertext expanded to become an object model abstraction, cascading style sheets expanded to create digital presentation views, and javascript expanded to become a general purpose controller langauage.

![How HTML-CSS-JS Get Applied On The Browser](https://raw.githubusercontent.com/awatson1978/meteor-cookbook/master/images/Static%20Website%20Architecture%20-%20After%20Browser%20Recieves%20Files.jpg)


Unfortunately, along the way, most server side developers wound up dealing with CSS and graphis buffering less and less, to the point that it became common for people to consider CSS a 'graphic designer responsibility' or 'just styling'.  

This was caused, in large part, by a division of labor that occured throughout much of the tech industry over the past 10 years, as client/server architectures resulted in a division of labor between "back end developers" and "front end developers".  The division of labor happened such that back-end developers began to view anything related to CSS as being a 'graphics design' issue and not part of their responsibilities. This is quite unfortunate, and has caused countless miscommunications since.  

However, they still knew that using an MVC model was a best practice, and they were all using default CSS stylesheets (even if many of them forget they were).  And so, being removed from the graphics buffering part of the application View portion of the MVC model, that's how they began reusing the 'View' in MVC to mean something slightly different.  

In the end, by assuming the default CSS stylesheets as a given, the conceptual MVC model shifted in much of the tech industry and wound up looking like this:

![Server Side MVC Approach](https://raw.githubusercontent.com/awatson1978/meteor-cookbook/master/images/Static%20Website%20Architecture%20-%20From%20the%20Server%20Devs%20Perspective.jpg)

Which is how client-side MVC patterns and server-side MVC patterns diverged.  Nowdays, these two different MVC models look something like this:

![Server vs Client Side MVC](https://raw.githubusercontent.com/awatson1978/meteor-cookbook/master/images/Results%20in%20Two%20Different%20MVC%20Models.jpg)

It should be noted that the server-side folks wills say that it's the client-side folks who've got it wrong.  And they'll point to Angular and Ruby and say "look how successful these projects are".  And "are you really questioning Google's MVC design?"  And the answer is... well, yeah.  Anybody who thinks that CSS isn't part of the View would be well served to revisit Knuth's Art of Computer Programming and the code for TeX and LaTeX, because Knuth has some things to say about font rendering.  

That being said, one could make the case that the Ruby/Angular MVC pattern is now the default MVC pattern for web apps.  And that the HTML/CSS/JS approach is more of a Model-Presentation-Control pattern (MPC), as per the OSI 7 Layer model.  

**Model View Controller Presentation (MVCP)**  
![View Model Controller Presentation](https://raw.githubusercontent.com/awatson1978/meteor-cookbook/master/images/View-Model-Controller-Presentation.jpg)

But that wouldn't be entirely correct.  What's really happening is that that the MVC models are actually two different models.  For convenience sake, lets call them View-Model-Controller-Presentation or MVCP, and Workflow-Model-View-Controller or WMVC. 

**Workflow Model View Controller (WMVC)**
![Workflow Model View Controller](https://raw.githubusercontent.com/awatson1978/meteor-cookbook/master/images/Workflow-Model-View-Controller.jpg)

Getting back to Meteor, the reason this is worth discussing is that Meteor has made the rather huge architectural decision to have both the client **and** the server written in the same language.  Principle 1:  Pure Javascript. It's huge.  It's elegant.  It's an oasis of sanity.  It makes a person unbelievably more productive.  

Yet, despite all those good things, it requires mashing these two different domains together - server side development and client-side development.  Isomorphic javascript requires that the Meteor community reconciles the server-side MVC patterns used by the Rubyists, Node.js folks, and Angular folks, with the client-side thick-client MVC patterns used by WinForm, .NET, Unity, and Flash developers.  

Because lets be real here...  MVC is a simplification.  If we were to diagram out what the render cycle *actually* looks like, it would be something more like this:  

![What the Rendering Pipeline Really Looks Like](https://raw.githubusercontent.com/awatson1978/meteor-cookbook/master/images/MVC%20Cycle%20-%20What%20it%20Really%20Looks%20Like.jpg)  


This is a discussion that had yet to begin in earnest.  Right now, it's a bit of a wild-west, with people exploring different patterns and designs.  CoffeeScript vs JavaScript.  Client-Side MVC vs Server-Side MVC.

Meteor-Cookbook tends towards a Client-Side MVC approach.  It's opinionated.  And there's a lot of reason for it.  Color coding.  Clarity of code.  Domain specific languages.  Domain specific tools.  But it's not the only approach to the MVC pattern.    

In the end, there's no 'correct' way to do MVC.  There are simpler approaches and more convoluted approaches.  Some approaches will save you effort and complexity on the front end and be more work to maintain later; while others will require more upfront effort and be easier to maintain later.  Some approaches will have cleaner semantic syntax; others will offer greater backwards compatibility with older libraries.  Ultimately, it will be about what kind of application you want to design.  

But, as you start building your app, start thinking about how to reconcile your client-side and server-side MVC models.  They will differ in the beginning, because Meteor isn't an MVC framework.  It's not really even an MVVM framework.  It's maybe an MVCP or WMVC framework.  But it's probably better to to call it a CMVVMCP or MCVVCMP framework, or something.  






