 
##Where should I put my files?  
The following section was originally hosted on Oortcloud's excellent FAQ, but I must dissent and disagree with his particular recommended structure.  While Oortcloud's and my approach are very similar, there have been some changes in the bundler since he wrote his FAQ, and there have been a number of discussions surrounding load ordering... both of which suggest a slightly revised application template.  Long story short, here's the template I use in **my* applications.  Is it the best approach?  Or the only approach?  Of course not.  I merely find it to be more effective than any other approach I've encountered.  

```js
.scrap                                    // keep a .scrap or .temp directory for scrap files

client/main.js                            // the main application javascript
client/main.html                          // the main application html
client/subscriptions.js                   // application subscriptions
client/routes.js                          // application routes 

client/compatibility/                     // legacy 3rd party javascript libraries

client/templates/                         // html files (document object model)
client/stylesheets/                       // css/less/styl files (view)
client/controllers/                       // js files (controllers)

server/publications.js                    // Meteor.publish definitions
server/environment.js                     // configuration of server side packages
server/methods.js                         // cMeteor.method() definitions
server/initializations/                   // code for initializing collections

libraries/                               // any common code for client/server.
libraries/scehmas.js                     // schema validations and the like
libraries/collections.js                 // collection definitions and allow/deny rules

packages/                                // place for all your atmosphere packages

public/                                  // static files that are served directly.
public/images                            // will serve images as: '/images/foo.jpg'

tests/                                   // unit test files (won't be loaded on client or server)

```
