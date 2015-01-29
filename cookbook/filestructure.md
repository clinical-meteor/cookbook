## Application File Structure


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

After creating those directories in the application folder, the next step is to create some structure for the MVC model, adding subscriptions and publications, and building out the rest of the application.  How to do that depends on what kind of application you're designing... ie. a static web page, a mobile application, a thick-client game, a thin-client applet, and so forth.  

=======================================
#### Static Landing Page. 
If you don't need a database, and just need to announce a project or host a static webpage, you'll only need the following.  

```sh
.scrap                                    # keep a .scrap or .temp directory for scrap files

client/startup.js                         # the main application javascript
client/main.html                          # the main application html
client/main.js                            # the main application html
client/main.less                          # the main application html
public/                                   # static files that are served directly.
public/images                             # will serve images as: '/images/foo.jpg'
```

=======================================
#### Express Style REST API

Conversely, if you just need a backend, try this and check out the REST API demo.  

```sh
server/appPublications.js                 # Meteor.publish definitions
server/appStartup.js                      # configuration of server side packages
server/collections.js                     # Meteor.method() definitions
server/collections.initialize.js/         # code for initializing collections

shared/                                   # any common code for client/server.
shared/routes.js                          # shared server/client routes
```

=======================================
#### Single-Page App  

Meteor's bread-and butter has always been the database-driven single page app, suitable for hosting web-apps, video games, collaborative utilities, and the like.  For high-performance single-page apps, try the following.  

```sh
.scrap                                    # keep a .scrap or .temp directory for scrap files

client/startup.js                         # the main application javascript
client/main.html                          # the main application html
client/main.js                            # the main application html
client/main.less                          # the main application html
client/subscriptions.js                   # application subscriptions


server/publications.js                    # Meteor.publish definitions
server/startup.js                         # configuration of server side packages
server/collections.js                     # Meteor.method() definitions
server/collections.initialize.js/         # code for initializing collections

shared/                                   # any common code for client/server.
shared/methods.js                         # schema validations and the like
shared/collections.js                     # collection definitions and allow/deny rules

packages/                                 # place for all your atmosphere packages

public/                                   # static files that are served directly.
public/images                             # will serve images as: '/images/foo.jpg'
```

=======================================
#### Workflow-Oriented App  

For larger apps, however, you'll need a router and the concept of workflow.  It's helpful to organize your directories to reflect the parts of your application.  
```sh
.scrap                                    # keep a .scrap or .temp directory for scrap files

client/app/appStartup.js                  # the main application javascript
client/app/appLayout.html                 # the main application html
client/app/appLayout.js                   # the main application html
client/app/appLayout.less                 # the main application html
client/app/appsSubscriptions.js           # application subscriptions
client/app/clientRoutes.js                # application routes 

client/app/workflows/                     # a directory contains many sub-directories of JS/HTML/CSS
client/app/workflows/accounts
client/app/workflows/errors
client/app/workflows/homePage
client/app/workflows/landingPage
Client/app/workflows/modals

server/appPublications.js                 # Meteor.publish definitions
server/appStartup.js                      # configuration of server side packages
server/collections.js                     # Meteor.method() definitions
server/initialization.js/                 # code for initializing collections

shared/                                   # any common code for client/server.
shared/methods.js                         # schema validations and the like
shared/collections.js                     # collection definitions and allow/deny rules
shared/routes.js                          # shared server/client routes

packages/                                 # place for all your atmosphere packages

public/                                   # static files that are served directly.
public/images                             # will serve images as: '/images/foo.jpg'

tests/                                    # unit test files (won't be loaded on client or server)
tests/nightwatch/walkthough.js            # nightwatch specific tests
```




=======================================
#### File Permissions  
If you're having any problems bundling your app, it's sometimes useful to check the permissions on your directory structure.  Here is a short audit script that will hopefully help get your directory permissions sorted out.

````sh
# make sure myapp works
sudo chmod -R 777 myapp
sudo chown -R username:wheel myapp

# make sure meteor works
sudo chown username:wheel ~/.meteorsession
sudo chown username:wheel ~/.meteor
sudo chmod -R 777 ~/.meteorsession
sudo chmod -R 777 ~/.meteor

# make sure npm has the right permissions
sudo chown username:wheel ~/.npm
sudo chmod -R 777 ~/.npm
````
