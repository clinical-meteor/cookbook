## Cookbook Conventions


Hello, and welcome to the Meteor Cookbook.

Before diving into this cookbook, please be aware of the following two conventions, which are used throughout these tutorials and examples.

#### The OSI Model  

First, it's generally structured around the Open Systems Interconnection (OSI) Model ((ISO/IEC 7498-1)).  
http://en.wikipedia.org/wiki/OSI_model

This model is typically used to describe network communications, and how packets of data travel from one machine to the next.  It describes how a client request to the server travels down the protocol stack, through the database, getting assigned TCP/IP headers, onto the wire (ethernet or wi-fi, etc), to the other machine, and back up the network stack to the server application.  That's how 90% of people understand the OSI model.

However, if you've worked with the OSI model **a lot**, you'll know that it can be used for a lot more.  In particular, it can also be used to model haptics, physical devices, and human-computer interfaces.  Because, in the end, physical devices like mice and printers are basically just other machines.  Very dumb ones.  But the principles of network communications still apply.  Your mouse is connected to your computer by a wire, and while it doesn't use the TCP/IP protocol, the {x,y} coordinates are still getting mapped to wire protocol.  And you can use the OSI model to describe that mapping.

Similarly, the OSI model can also be used to describe video transmission...  video camera input, video output, and all the steps in-between, including analog RGBA signalling.   Instead of Ethernet and network cables, the Physical and Data Link layers are video screens and pixels.  Instead of data packets, one can talk about JPG and PNG images (which are just pixel based data packets).  And so forth.  

And finally, if you take all of that one step further, and you make a couple of funky assumption about eyes being networked video camera's to a person's brain, you can model computer-human interfaces and interactions with the OSI model.  You really can.  It works.  

So, be forewarned:  the Meteor Cookbook adopts a rather generous interpretation of the OSI model to describe client side devices, device drivers, haptics, and the like.  And rather than placing Mice and other client-side devices in the Application Layer, they're in the Physical and DataLink layer.  It's more of a mesh networking approach, in keeping with today's modern wireless input devices.  


#### Model-View-Controller  

Second, the Meteor Cookbook makes an opinionated choice about how to treat MVC, and tends towards a thick-click and desktop models of how MVC is structured. In particular, it avoids server-side Ruby and Angular MVC patterns, which treat a View as a collection of HTML and Javascript.  

A little background to put this into context.  In the 1970s, Xerox PARC developed the first mouse interface and first GUI.  They used a Model-View-Controller paradigm, which was copied throughout most of the 1980s by Apple, SGI, Sun, and all the other computer tech companies of the era.  MVC was fairly well understood during those days.  

Then, in the 1990s, the Web came onto the scene, and people started building server-client applications. This caused a big schism in how people understood the MVC model.  The client-side developers continued to apply the same MVC models from before, which is how Web Browsers wound up ubiquitously using HTML, CSS, and JS to render pages.  

However, server developers tend not to focus so much on how a page renders.  By and large, there was a division of labor that occured, with back-end server developers worrying more about performance, databases, workflow, and so forth.  The division of labor happened such that they began to view anything related to CSS as being a 'graphics design' issue.  And, being removed from the View portion of the MVC model, they began reusing the 'View' in MVC to mean something slightly different.  

It should be noted that the server-side folks wills say that it's the client-side folks who've got it wrong.  And they'll point to Angular and Ruby and say "look how successful these projects are".  And "are you really questioning Google's MVC design?"  And the answer is... well, yeah.  Anybody who thinks that CSS isn't part of the View would be well served to revisit Knuth's Art of Computer Programming and the code for TeX and LaTeX, because Knuth has some things to say about font rendering.  

That being said, one could make the case that the Ruby/Angular MVC pattern is now the default MVC pattern for web apps.  And that the HTML/CSS/JS approach is more of a Model-Presentation-Control pattern (MPC), as per the OSI 7 Layer model.  At which point we can split hairs about naming conventions and terminology.

Getting back to Meteor, the reason this is worth discussing is that Meteor has made the rather huge architectural decision to have both the client **and** the server written in the same language.  Principle 1:  Pure Javascript. It's huge.  It's elegant.  It's an oasis of sanity.  It makes a person unbelievably more productive.  

Yet, despite all those good things, it requires mashing these two different domains together - server side development and client-side development.  Isomorphic javascript requires that the Meteor community reconciles the server-side MVC patterns used by the Rubyists, Node.js folks, and Angular folks, with the client-side thick-client MVC patterns used by WinForm, .NET, Unity, and Flash developers.  

This is a discussion that had yet to begin in earnest.  Right now, it's a bit of a wild-west, with people exploring different patterns and designs.  CoffeeScript vs JavaScript.  Client-Side MVC vs Server-Side MVC.

Meteor-Cookbook tends towards a Client-Side MVC approach.  It's opinionated.  And there's a lot of reason for it.  Color coding.  Clarity of code.  Domain specific languages.  Domain specific tools.  But it's not the only approach to MVC patterns.  

So, yeah... just be aware of all that as you use this cookbook.

#### Browsers and Operating Systems  
Generally speaking, the Cookbook caters to a Mac development environment, and WebKit browsers.  The official Meteor position is that Meteor is going to support Windows and SQL databases in version 1.1 or later.  The Meteor Cookbook is focused on Meteor 1.0, then. 


