# Application File Structure
The first thing you need to know when structuring your apps is that Meteor has some specific meanings for certain directory names.  At a very basic level, the following directories are "baked in" the Meteor bundler.

## client
All code in the *client* directory is run only in the client-side, or web browser.

## compatibility
The *compatibility* directory contains legacy or 3rd party code, such as JavaScript libraries, shims, etc.

## lib
The *lib* directory is loaded before other directories in your Meteor project. This means that you can control load order within your application by placing files within a *lib* directory (inside any project directory).

## main
The *main* directory is loaded after other directories in your project. This means you can control load order within your application by placing files within a *main* directory (inside any project directory).

## packages
The *packages* directory is where you will keep custom package installations, including packages you may be developing. I.e. this directory will contain Meteor packages that are not auto-installed by the `meteor add <package-name>` command.

## private
The *private* directory contains static files that should only be available on the web server.

## public
The *public* directory contains static files that are only available on the application client. This may including branding assets, etc.

## server
The *server* directory contains server-side assets. This can include authentication logic, methods, and other code that may need security consideration.

## tests
The *tests* directory contains unit and functional tests for your application.

# Example file structures
Keeping in mind the core directory conventions outlined above, lets take a quick look at some common project structures.
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

## Basic file structure
When creating a new application, sandboxing some new functionality, or otherwise starting a new project, you may frequently run the following series of commands:

````sh
meteor create myapp
cd myapp
mkdir client
mkdir server
mkdir public
mkdir packages
mkdir tests
mkdir shared
...

meteor add <pakage-name>
...
````

After creating those directories in the application folder, the next step is to create some structure for the MVC model, adding subscriptions and publications, and building out the rest of the application.  How to do that depends on what kind of application you're designing... ie. a static web page, a mobile application, a thick-client game, a thin-client applet, and so forth.  

## Static Landing Page. 
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

## REST API

If you just need an application backend, try this and check out the REST API example.  

```sh
server/appPublications.js                 # Meteor.publish definitions
server/appStartup.js                      # configuration of server side packages
server/collections.js                     # Meteor.method() definitions
server/collections.initialize.js/         # code for initializing collections

shared/                                   # any common code for client/server.
shared/routes.js                          # shared server/client routes
```

=======================================
## Single-Page App  

Meteor's bread-and butter has always been the database-driven single page app. This structure is suitable for creating web-apps, video games, collaborative utilities, and the like.  For single-page apps, try the following.  

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
## Workflow-Oriented App  

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



# File Permissions  
If you're having any problems bundling your app, it's sometimes useful to check the permissions on your directory structure.  Here is a short audit script that will hopefully help get your directory permissions sorted out.

````sh
# make sure myapp works
sudo chmod -R 777 myapp
sudo chown -R username:wheel myapp
sudo chmod -R 777 myapp/.meteor

# make sure meteor works
sudo chown username:wheel ~/.meteorsession
sudo chown username:wheel ~/.meteor
sudo chmod -R 777 ~/.meteorsession
sudo chmod -R 777 ~/.meteor

# make sure npm has the right permissions
sudo chown username:wheel ~/.npm
sudo chmod -R 777 ~/.npm
````
