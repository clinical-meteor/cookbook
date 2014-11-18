## Application File Structure
**Where should I put my files?**    


The first thing you need to know in structuring your apps is that the Meteor bundler has some directories that it is hardcoded to look for.  At a very basic level, the following directories are sort of baked into the Meteor bundler, and is where you should begin with structuring larger applications.

```sh
client/                                  # client application code
client/compatibility/                    # legacy 3rd party javascript libraries
lib/                                     # any common code for client/server.
packages/                                # place for all your atmosphere packages
private/                                 # static files that only the server knows about
public/                                  # static files that are available to the client
server/                                  # server code
tests/                                   # unit test files (won't be loaded on client or server)
```

As such, I find myself running through the following commands whenever I'm creating a new applet, sandboxing some new functionality, or otherwise starting a new project.

````sh
meteor create myapp
cd myapp
mkdir client
mkdir server
mkdir public
mkdir packages
mkdir tests
mkdir shared
mkdir client/app
mkdir client/app/sidebars
mkdir client/app/headers
mkdir client/app/modals
mkdir client/app/workflows

meteor add less
meteor add mrt:bootstrap-3
meteor add iron:router

````

After creating those directories in the application folder, the next step is to create some structure for the MVC model, adding subscriptions and publications, and building out the rest of the application.  How to do that depends on what kind of application you're designing... ie. a static web page, a mobile application, a thick-client game, a thin-client applet, and so forth.  I find that most of my applications are starting to use the following structure.

```sh
.scrap                                    # keep a .scrap or .temp directory for scrap files

client/app/app.startup.js                 # the main application javascript
client/app/app.layout.html                # the main application html
client/app/app.layout.js                  # the main application html
client/app/app.layout.less                # the main application html
client/app/app.subscriptions.js           # application subscriptions
client/app/app.routes.js                  # application routes 

client/app/workflows/                         

server/app.publications.js                # Meteor.publish definitions
server/app.startup.js                     # configuration of server side packages
server/methods.collection.js              # cMeteor.method() definitions
server/initialize.collection.js/          # code for initializing collections

shared/                                   # any common code for client/server.
shared/mehods.js                          # schema validations and the like
shared/collections.js                     # collection definitions and allow/deny rules

packages/                                 # place for all your atmosphere packages

public/                                   # static files that are served directly.
public/images                             # will serve images as: '/images/foo.jpg'

tests/                                    # unit test files (won't be loaded on client or server)
tests/walkthough.js
```

------------------------------------
#### File Permissions  
If you're having any problems bundling your app, it's sometimes useful to check the permissions on your directory structure.  Here is a short audit script that will hopefully help get your directory permissions sorted out.

````sh
sudo chmod -R g+w myapp
sudo chown -R username:wheel myapp
sudo chown username:wheel .meteor
sudo chown username:wheel ~/.meteorsession
sudo chown username:wheel ~/.meteor
````
