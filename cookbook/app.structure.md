## Reserved Directories
The first thing you need to know when structuring your apps is that Meteor has some specific meanings for certain directory names.  At a very basic level, the following directories are "baked in" the Meteor bundler.

#### both
the *both* directory contains common files that are shared between the application client and server. This can include collections and routing logic.

#### client
All code in the *client* directory is run only in the client-side, or web browser.

#### compatibility
The *compatibility* directory contains legacy or 3rd party code, such as JavaScript libraries, shims, etc.

#### lib
The *lib* directory is loaded before other directories in your Meteor project. This means that you can control load order within your application by placing files within a *lib* directory (inside any project directory).

#### packages
The *packages* directory is where you will keep custom package installations, including packages you may be developing. I.e. this directory will contain Meteor packages that are not auto-installed by the `meteor add <package-name>` command.

#### private
The *private* directory contains static files that should only be available on the web server.

#### public
The *public* directory contains static files that are only available on the application client. This may including branding assets, etc.

#### server
The *server* directory contains server-side assets. This can include authentication logic, methods, and other code that may need security consideration.

#### tests
The *tests* directory contains unit and functional tests for your application.

## Default Application Scaffold
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

## Create an Application Skeleton
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




