## Application File Structure
**Where should I put my files?**    


The first thing you need to know in structuring your apps is that the Meteor bundler has some directories that it is hardcoded to look for.  At a very basic level, the following directories are sort of baked into Meteor bundler, and is where you should begin with structuring larger applications.

```sh
client/                                  # client application code
client/compatibility/                    # legacy 3rd party javascript libraries
lib/                                     // any common code for client/server.
packages/                                // place for all your atmosphere packages
private/                                 // static files that only the server knows about
public/                                  // static files that are available to the client
server/                                  // server code
tests/                                   // unit test files (won't be loaded on client or server)

```

After you create those directories in your application folder, the next step is to create some structure for your MVC model, add subscriptions and publications, and build out the rest of your application.  How to do that depends on what kind of application you're designing... ie. a static web page, a mobile application, a thick-client game, a thin-client applet, and so forth.  I find that most of my applications are starting to use the following structure, which uses HTML/CSS/JS as my Model/View/Controller.  

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

lib/                                      // any common code for client/server.
lib/schemas.js                            // schema validations and the like
lib/collections.js                        // collection definitions and allow/deny rules

packages/                                // place for all your atmosphere packages

public/                                  // static files that are served directly.
public/images                            // will serve images as: '/images/foo.jpg'

tests/                                   // unit test files (won't be loaded on client or server)

```
