## Cookbook Conventions


Hello, and welcome to the Meteor Cookbook.

Before diving into this cookbook, please be aware of the following two conventions, which are used throughout these tutorials and examples.


#### Browsers and Operating Systems  
Generally speaking, the Cookbook caters to a Mac development environment, WebKit browsers (specifically Chrome, but also Safari), a virtualized Ubuntu server hosting environment, and support of the iPad and iPhone.  

The official Meteor position is that Meteor is going to support Windows and SQL databases in version 1.1 or later.   Until then, however, the fact of the matter is that Meteor basically only runs on Mac/Linux.  And since the Meteor Cookbook is focused on documenting Meteor 1.0, you can basically assume that all the examples in the Cookbook are written with Mac and Chrome in mind.



#### Model-View-Controller  

The Meteor Cookbook makes an opinionated choice about how to treat MVC, and tends towards a thick-click and desktop models of how MVC is structured. In particular, it avoids server-side Ruby and Angular MVC patterns, which treat a View as a collection of HTML and Javascript.  

A little background to put this into context.  In the 1970s, Xerox PARC developed the first mouse interface and first GUI.  They used a Model-View-Controller paradigm, which was copied throughout most of the 1980s by Apple, SGI, Sun, and all the other computer tech companies of the era.  MVC was fairly well understood during those days.  

![MVC History](https://raw.githubusercontent.com/awatson1978/meteor-cookbook/master/images/MVC%20Cycle%20-%20Traditional%20Model.jpg)

Then, in the 1990s, the Web came onto the scene, and people started building server-client applications. This caused a big schism in how people understood the MVC model.  The client-side developers continued to apply the same MVC models from before, which is how Web Browsers wound up ubiquitously using HTML, CSS, and JS to render pages.  

![Basic Server-Client Technologies](https://raw.githubusercontent.com/awatson1978/meteor-cookbook/master/images/Static%20Website%20Architecture%20-%20Before%20Loading%20Page.jpg)  

The JS, HTML, and CSS files get shipped down to the client, and the HTML gets rendered to the DOM, which then gets CSS applied to it in the render tree, which gets gets javascript applied to it, which gets shipped to the graphics buffer and displayed on the device screen.

![How HTML-CSS-JS Get Applied On The Browser](https://raw.githubusercontent.com/awatson1978/meteor-cookbook/master/images/Static%20Website%20Architecture%20-%20After%20Browser%20Recieves%20Files.jpg)




Unfortunately, most server side developers tend to forget about the CSS subsystem, or dismiss it 'graphic designer responsibilities' or 'just styling'.  

This was caused, in large part, by a division of labor that occured throughout much of the tech industry over the past 10 years, as client/server architectures resulted in a division of labor between "back end developers" and "front end developers".  The division of labor happened such that back-end developers began to view anything related to CSS as being a 'graphics design' issue and not part of their responsibilities.

However, they still knew that using an MVC model was a best practice, and they were all using default CSS stylesheets even if many of them forget they were.  And so, being removed from the View portion of the MVC model, that's how they began reusing the 'View' in MVC to mean something slightly different.  

In the end, by assuming the default CSS stylesheets as a given, the conceptual MVC model shifted in much of the tech industry and wound up looking like this:

![Server Side MVC Approach](https://raw.githubusercontent.com/awatson1978/meteor-cookbook/master/images/Static%20Website%20Architecture%20-%20From%20the%20Server%20Devs%20Perspective.jpg)

Which is how client-side MVC patterns and server-side MVC patterns diverged.  Nowdays, these two different MVC models look something like this:

![Server vs Client Side MVC](https://raw.githubusercontent.com/awatson1978/meteor-cookbook/master/images/Results%20in%20Two%20Different%20MVC%20Models.jpg)

It should be noted that the server-side folks wills say that it's the client-side folks who've got it wrong.  And they'll point to Angular and Ruby and say "look how successful these projects are".  And "are you really questioning Google's MVC design?"  And the answer is... well, yeah.  Anybody who thinks that CSS isn't part of the View would be well served to revisit Knuth's Art of Computer Programming and the code for TeX and LaTeX, because Knuth has some things to say about font rendering.  


That being said, one could make the case that the Ruby/Angular MVC pattern is now the default MVC pattern for web apps.  And that the HTML/CSS/JS approach is more of a Model-Presentation-Control pattern (MPC), as per the OSI 7 Layer model.  At which point we can split hairs about naming conventions and terminology.

Getting back to Meteor, the reason this is worth discussing is that Meteor has made the rather huge architectural decision to have both the client **and** the server written in the same language.  Principle 1:  Pure Javascript. It's huge.  It's elegant.  It's an oasis of sanity.  It makes a person unbelievably more productive.  

Yet, despite all those good things, it requires mashing these two different domains together - server side development and client-side development.  Isomorphic javascript requires that the Meteor community reconciles the server-side MVC patterns used by the Rubyists, Node.js folks, and Angular folks, with the client-side thick-client MVC patterns used by WinForm, .NET, Unity, and Flash developers.  

Because lets be real here...  MVC is a simplification.  If we were to diagram out what the render cycle *actually* looks like, it would be something more like this:  

[What the Rendering Pipeline Really Looks Like](https://raw.githubusercontent.com/awatson1978/meteor-cookbook/master/images/MVC%20Cycle%20-%20What%20it%20Really%20Looks%20Like.jpg)


This is a discussion that had yet to begin in earnest.  Right now, it's a bit of a wild-west, with people exploring different patterns and designs.  CoffeeScript vs JavaScript.  Client-Side MVC vs Server-Side MVC.

Meteor-Cookbook tends towards a Client-Side MVC approach.  It's opinionated.  And there's a lot of reason for it.  Color coding.  Clarity of code.  Domain specific languages.  Domain specific tools.  But it's not the only approach to MVC patterns.  

So, yeah... just be aware of all that as you use this cookbook.


#### The OSI Model  

Older versions of the Cookbook were heavily structured around the Open Systems Interconnection (OSI) Model ((ISO/IEC 7498-1)).  
http://en.wikipedia.org/wiki/OSI_model

This model is typically used to describe network communications, and how packets of data travel from one machine to the next.  It describes how a client request to the server travels down the protocol stack, through the database, getting assigned TCP/IP headers, onto the wire (ethernet or wi-fi, etc), to the other machine, and back up the network stack to the server application.  That's how 90% of people understand the OSI model.

![Traditional OSI 7 Layer Model](http://i.technet.microsoft.com/dynimg/IC213395.gif)  

However, if you've worked with the OSI model **a lot**, you'll know that it can be used to describe haptics, video recording/broadcasting, human-computer interfaces, business logic, and more.  

Early versions of the Cookbook used this conceptual model to organize files, identify subsystems and modules, and to sort of 'reverse engineer' Meteor.  As time went on, however, it became increasingly apparent how Meteor was architected, and how it lived in layers 5 through 7, and how an indepth discussion of Model/View/Controller patterns was more important than OSI networking patterns.  

So, going forward, we'll be seeing less of the OSI model.  But you may still run into references here and there, as we clean up the Cookbook.


#### Miscellaneous Notes & Links  

Some extra discussion on MVC vs PAC patterns...  
http://www.garfieldtech.com/blog/mvc-vs-pac  

![Browser Rendering Workflow](http://orm-chimera-prod.s3.amazonaws.com/1230000000545/images/hpbn_1001.png)  
