#### Example Scaffold:  Static Landing Page. 
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

#### Example Scaffold:  REST API

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
#### Example Scaffold:  Single-Page App  

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
#### Example Scaffold:  Workflow-Oriented App  

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
