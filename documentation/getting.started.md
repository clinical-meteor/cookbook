===========================================
## Getting Started  

To start with the Clinical Meteor Software Development Kit, we're going to need to set up a complete development environment.  There's a large ecosystem of tools to use, so the focus in this document is on tools that are known to work together well on Mac OSX and are popular within the Meteor community.   


[Node JS](http://nodejs.org/en/) - Server-side javascript environment. Use the LTS release.  
[Java 8](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html) - Needed QA testing tools.
[Chrome](https://www.google.com/chrome/browser/desktop/)  
[Atom](http://www.atom.io)  
[GitHub Desktop App](https://desktop.github.com/)  

===========================================
#### Chrome Environment  

Clinical Meteor prefers a Chrome environment.  So much so, that its arguably an alternative Chrome OS.  Not only will we be targeting Chrome as our preferred browser; we'll also be installing utilities as Chrome extensions; using a code editor built on Chrome, and using Chrome in our QA test runner.  Clinical Meteor supports other browsers (particularly Firefox and Safari), but the bulk of it's work is done with Chrome.  

Once you get Chrome installed, we recommend the following extensions; which will help develop Clinical Meteor apps.  

[Postman HTTP/REST Utility](https://www.getpostman.com/) - HTTP protocol utility for programming REST interfaces.  
[MeteorDevTools](https://chrome.google.com/webstore/detail/meteor-devtools/ippapidnnboiophakmmhkdlchoccbgje) - Blaze, DDP, and Minimongo debugging utilities.


===========================================
#### Code Editor

Clinical Meteor recommends using Atom for your code editor, since it's built in Chrome, and can fully leverage Meteor's isomorphic javascript framework.  After you install the application, be sure to run **File > Install Shell Commands** which will allow you to run the `atom` and `apm` commands from the terminal.  After that is installed, we recommend the following packages:  

```sh
# atom packages
apm install atom-bootstrap3
apm install atom-handlebars
apm install color-picker
apm install copy-filename
apm install jsformat
apm install language-html
apm install language-spacebars
apm install language-javascript-jsx
apm install language-babel
apm install less-autocompile
apm install line-count
apm install linter
apm install linter-eslint
apm install linter-handlebars
apm install linter-jsxhint
apm install merge-conflicts
apm install meteor-api
apm install meteor-helper
apm install minimap
apm install react

# npm tools that atom will use
npm config get prefix  
npm install -g eslint
```

===========================================
#### Version Control Software     

The easiest way to install `git` is to install the [GitHub Desktop App](https://desktop.github.com/).  You'll then have access to both the GUI and the command line.   

```sh
$ git config --global user.name "Jane Doe"
$ git config --global user.email janedoe@example.com
$ git config --global core.editor atom -w
```

===========================================
#### Meteor Installation Walkthrough  

This quickstart is written for Mac OSX Mavericks, and is a bit more verbose than other installation instructions.  It should hopefully cover a few edge cases, such as setting your path, which can cause an installation to go awry.  

````sh
# install meteor
curl https://install.meteor.com | sh

# check it's installed correctly
meteor --version

# install npm
curl -0 -L https://npmjs.org/install.sh | sh

# check node is installed correctly
node --version

# check npm is installed correctly
npm -version

# find your npm path
which npm

# make sure npm is in your path
sudo nano ~/.profile
  export PATH=$PATH:/usr/local/bin
 ````


If you have any problems with EACCESS pr ENOENT errors, check the file permissions of your NPM directories.  
https://docs.npmjs.com/getting-started/fixing-npm-permissions



===========================================
#### Database Tools  

[Robomongo](http://robomongo.org/) - A sweet, sweet database management tool for MongoDB.

Here's the script the author uses when setting up a new development workstation.  It's certainly not the only environment setup script, and it's by no means authoritative.  It's simply what seems to work.


````sh
# install stand-alone mongo with the gui installer
http://www.mongodb.org/dr//fastdl.mongodb.org/osx/mongodb-osx-x86_64-2.6.3.tgz/download

# or install from command line
curl http://downloads.mongodb.org/osx/mongodb-osx-x86_64-2.6.3.tgz > mongodb-osx-x86_64-2.6.3.tgz
tar -zxvf mongodb-osx-x86_64-2.6.3.tgz
mkdir -p /var/mongodb
cp -R -n mongodb-osx-x86_64-2.6.3/* /usr/local/mongodb

# make sure mongo is in your local path
nano ~/.profile
  export PATH=$PATH:/usr/local/mongodb/bin

# or install it to the global path
nano /etc/paths
  /usr/local/mongodb/bin

# create mongo database directory
mkdir /data/
mkdir /data/db
chown -R username:admin /data

# run mongodb server
mongod
ctrl-c

# check that you can connect to your meteor app with stand-alone mongo
terminal-a$ meteor create helloworld
terminal-a$ cd helloworld
terminal-a$ meteor

terminal-b$ mongo -port 3001

# install robomongo database admin tool
http://robomongo.org/

# check you can connect to your mongo instance with robomongo
terminal-a$ meteor create helloworld
terminal-a$ cd helloworld
terminal-a$ meteor

Dock$ Robomongo > Create > localhost:3001

# install node-inspector
terminal-a$  npm install -g node-inspector

# start meteor
terminal-a$  cd helloworld
terminal-a$  NODE_OPTIONS='--debug-brk --debug' mrt run

# alternatively, some people report this syntax being better
terminal-a$  sudo NODE_OPTIONS='--debug' ROOT_URL=http://helloworld.com meteor --port 80

# launch node-inspector along side your running app
terminal-b$  node-inspector

# go to the URL given by node-inspector and check it's running
http://localhost:8080/debug?port=5858

# install jshint
npm install -g jshint

# run code analysis on local directory
cd helloworld
jshint .

````


===========================================
## Test-Driven-Development Quickstart  

Test-driven development is essential for building larger and more complex apps.  The following script will get you up-and-running with automated browser walkthroughs using the Nightwatch bridge to a Selenium Server.  Be aware that this script won't create tests for you.  You will need to create a tests/nightwatch directory with walkthroughs in it.

````sh
# install the StarryNight utility
npm install starrynight -g

# add .meteor/nightwatch.json to our application
$ starrynight generate-autoconfig

# add acceptance tests to your application (using the nightwatch framework)
$ starrynight scaffold --framework nightwatch

# run your validation tests using NightWatch
$ starrynight run-tests --framework nightwatch

# run any verification tests you may have written with TinyTest
$ starrynight run-tests --framework tinytest-ci

````  




===========================================
## Project Management Tools  

[Slack](https://slack.com/) - Collaborative project tracking feeds.    
[InVision Sync](http://blog.invisionapp.com/an-all-new-invision-sync/) - Collaborative wireframing and prototyping.  
[Zenhub.io](zenhub.io) - Project management Kanban boards for GitHub.  
