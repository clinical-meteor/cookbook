## Development Tools

You're going to need to set up a development environment if you want to program in Meteor.  There's a growing ecosystem of tools to use, so the focus in this document is on tools that are known to work together well and are popular within the Meteor community.   

===============================================================
#### Integrated Development Environments

Start by selecting an Integrated Development Environment (IDE), configuring it so it works with Meteor, and setting up debugging and profiling utilities.  Meteor Cookbook's recommendation in selecting an IDE is the following: go with WebStorm if you want the most full-featured team tools currently available; but go with Atom if you want the most advanced tool for the most bleeding-edge isomorphic development.

[Atom](http://www.atom.io) - Javascript IDE that can fully leverage Meteor's isomorphic javascript framework.  Recommended.  
[WebStorm](http://www.jetbrains.com/webstorm/) - The most full featured IDE currently available for Meteor.    
[Sublime](http://www.sublimetext.com/) - Light-weight and popular text editor.     
[Nitrous.io](https://www.nitrous.io/) - The original Cloud Development for Meteor.   
[Cloud9](https://c9.io/)  - The newest Cloud Development offering that supports Meteor, with a [tutorial](http://simpleprogrammer.com/2014/10/13/getting-started-meteor-tutorial-cloud/).  
[MeteorPad](http://meteorpad.com/pad/J5Ls2Fc8imyXnz8yM)  - Lightweight cloud editing for mobile prototyping.  

===============================================================
#### Database Tools

Once you get a 'Hello World' app running, you'll need to start paying attention to your collection and document schemas, and will need some tools for managing your database.  Start with Robomongo.  

[Robomongo](http://robomongo.org/) - A sweet, sweet database management tool.  Highly recommended.   
[JSON Generator](http://www.json-generator.com/) - Invaluable utility for generating sample datasets.   
[MacOSX Mongo Preference Page](http://blog.mongodb.org/post/28925264384/macosx-preferences-pane-for-mongodb) - Preferences GUI for MacOSX.  
[MongoHub](http://mongohub.todayclose.com/) - Another Mongo GUI, similar to RoboMongo.  
[Mongo3](http://mongo3.com/) - It's in Ruby, but it will let you visualize replication sets.   
[Mongo Monitoring Service](https://mms.mongodb.com/setup)  - Once you're ready to bring something into production.  
  
  
===============================================================
#### Remote Collaboration Utilities for Distributed Developers

Developing Meteor apps usually means testing multi-client reactivity, which requires collaboration tools.  The following tools have proven to be popular within the Meteor community.  

[Google Hangouts](http://www.google.com/+/learnmore/hangouts/)  - Video conferencing and chat.  
[Meeting Hero](http://www.meetinghero.com/)  - Collaborative meeting planning.  
[Hackpad](https://hackpad.com)  Collaborative document editing.  
[Slack](https://slack.com/) - Collaborative project tracking feeds.    
[MadEye](http://madeye.io/) - Collaborative web editor.    
[Screenhero](http://screenhero.com) - Collaborative screen sharing.  
[InVision](https://projects.invisionapp.com/d/main#/projects) - Collaborative wireframing and prototyping.  
[Proto.io](https://proto.io/)  Wireframing and prototyping.  
[HuBoard](https://huboard.com) - Kanban boards for GitHub.   
[Zapier](https://zapier.com/) - The best apps.  Together.  
[Teamwork.com](https://www.teamwork.com/) - Traditional project management & gannt charts.   
[Sprint.ly](https://sprint.ly/) - More kanban boards and sprint planning that works with GitHub.  
[LucidCharts](https://www.lucidchart.com/) - Web based Visio alternative for flowcharting.

===============================================================
#### REST Clients  

If you want to integrate Meteor with an external API, it's likely that it's going to exposed as a REST interface.  We tend to use the following Chrome apps for testing REST APIs.  

[Dev HTTP Client](https://chrome.google.com/webstore/detail/dev-http-client/aejoelaoggembcahagimdiliamlcdmfm)      
[REST Client](https://chrome.google.com/webstore/detail/postman-rest-client/fdmmgilgnpjigdojojpjoooidkmcomcm/)      
  

===============================================================
#### Debuggers  

Most debugging happens in the terminal or in the Chrome or Safari develop tools, which are plenty sophisticated enough for 99% of your needs.  However, if you want to debug on Firefox or need extra server debugging functionality, there are a few extra utilities you can use.  

[Firefox - Firebug](https://getfirebug.com/)    
[Firebug (Firefox)](https://getfirebug.com/)   
[Node-Inspector](https://github.com/node-inspector/node-inspector)    
  
