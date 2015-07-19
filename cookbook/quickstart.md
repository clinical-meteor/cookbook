Meteor 1.0 Quickstart Installation
===========================================

This quickstart is written for Mac OSX Mavericks, and is a bit more verbose than other installation instructions.  It should hopefully cover a few edge cases, such as setting your path, which can cause an installation to go awry.  

````sh
# install meteor
curl https://install.meteor.com | sh
 
# check it's installed correctly
meteor --version
 
# install node
# as of OSX Mavericks, we need the GUI installer (?!)
# when a good command line alternative is found, we'll post it
http://nodejs.org/download/
 
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

Meteorite Installation (Deprecated)
===========================================
Meteorite is mostly deprecated utility and package management system used in pre 0.9 days.  Nowadays, it's mostly only used for research, bleeding-edge development, and backwards compatibility for old apps.  If you haven't been a regular user of Meteroite, you probably don't need it.  

````sh
# install meteorite
npm install -g meteorite
 
# and if you have problems with permissions
npm install -g meteorite
 
# check mrt is installed correctly
mrt --version
 
# find your mrt path
which mrt
locate mrt
 
# make sure meteorite is in your path
nano ~/.profile
  export PATH=$PATH:/usr/local/share/npm/bin
 
# check mrt is installed correctly
mrt --version
````


Meteor Development Tools Quickstart
===========================================
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


Test-Driven-Development Quickstart
===========================================
Test-driven development is essential for building larger and more complex apps.  The following script will get you up-and-running with automated browser walkthroughs using the Nightwatch bridge to a Selenium Server.  Be aware that this script won't create tests for you.  You will need to create a tests/nightwatch directory with walkthroughs in it.

````sh
# install clinical-nightwatch
terminal-a$ cd helloworld
terminal-a$ meteor add clinical:nightwatch

# In the same way that we run 'meteor mongo' in a separate terminal while our application is already running,
# we want to open up a new terminal, and run nightwatch
terminal-b$ ln -s .meteor/local/build/programs/server/assets/packages/clinical_nightwatch/launch_nightwatch_from_app_root.sh run_nightwatch.sh
terminal-b$ sudo chmod +x run_nightwatch.sh
terminal-b$ sudo ./run_nightwatch.sh

# add some tests and repeat until passing green...
terminal-b$ sudo ./run_nightwatch.sh

# as you develop tests, you might want to do something clever like pass in arguments and run specific tests
terminal-b$ sudo ./run_nightwatch.sh -t tests/nightwatch/walkthrough.js

````
