## Reserved Directories
The first thing you need to know when structuring your apps is that the Meteor tool has some directories that are hard-coded with specific logic.  At a very basic level, the following directories are "baked in" the Meteor bundler.

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


##### client
All code in the *client* directory is run only in the client-side, or web browser.

##### compatibility
The *compatibility* directory contains legacy or 3rd party code, such as JavaScript libraries, etc.

##### lib
The *lib* directory is loaded before other directories in your Meteor project, and is loaded on both the server and client. This is the preferred place to define data models, isomorphic libraries, and business logic.

##### packages
The *packages* directory is where custom packages are stored  during local development. 

##### private
The *private* directory contains static files that should only be available on the web server.

##### public
The *public* directory contains static files that are only available on the application client. This may including branding assets, etc.

##### server
The *server* directory contains server-side assets. This can include authentication logic, methods, and other code that may need security consideration.

##### tests
The *tests* directory is omitted by default when your application is bundled and deployed.  

==========================================
## Package-Based Application Architecture

Even though there is no hard-coded logic for directories in packages, we find that it's a very good practice to use the same directory conventions when building packages.  This creates a natural refactor path as features are prototyped in the app, and then extracted into packages to be shared between apps.

```sh
client/                                  # client application code
client/compatibility/                    # legacy 3rd party javascript libraries
lib/                                     # any common code for client/server.
packages/                                # place for all your atmosphere packages
packages/foo/client                      # place for all your atmosphere packages
packages/foo/lib                         # place for all your atmosphere packages
packages/foo/server                      # place for all your atmosphere packages
packages/foo/tests                       # place for all your atmosphere packages
private/                                 # static files that only the server knows about
public/                                  # static files that are available to the client
server/                                  # server code
tests/                                   # unit test files (won't be loaded on client or server)
```
