Meteor Quickstart Installation - OSX Mavericks
===========================================

This quickstart is written for Mac OSX, and is a bit more verbose than other installation instructions.  It should hopefully cover a few edge cases, such as setting your path, which can cause an installation to go awry.  

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
sudo curl -0 -L https://npmjs.org/install.sh | sh

# check node is installed correctly
node -version
 
# check npm is installed correctly
npm -version
 
# find your npm path
which npm
 
# make sure npm is in your path
sudo nano ~/.profile
  export PATH=$PATH:/usr/local/bin
 
# install meteorite
npm install -g meteorite
 
# and if you have problems with permissions
sudo -H npm install -g meteorite
 
# check mrt is installed correctly
mrt --version
 
# find your mrt path
which mrt
locate mrt
 
# make sure meteorite is in your path
sudo nano ~/.profile
  export PATH=$PATH:/usr/local/share/npm/bin
 
# check mrt is installed correctly
mrt --version
````




Meteor Development Tools Quickstart
===========================================

````sh
# install stand-alone mongo with the gui installer
http://www.mongodb.org/dr//fastdl.mongodb.org/osx/mongodb-osx-x86_64-2.6.3.tgz/download

# or install from command line
curl http://downloads.mongodb.org/osx/mongodb-osx-x86_64-2.6.3.tgz > mongodb-osx-x86_64-2.6.3.tgz
tar -zxvf mongodb-osx-x86_64-2.6.3.tgz
sudo mkdir -p /var/mongodb
cp -R -n mongodb-osx-x86_64-2.6.3/* /usr/local/mongodb

# make sure mongo is in your local path
sudo nano ~/.profile
  export PATH=$PATH:/usr/local/mongodb/bin
  
# or install it to the global path
sudo nano /etc/paths
  /usr/local/mongodb/bin
  

# create mongo database directory
mkdir /data/
mkdir /data/db
sudo chown -R username:admin /data

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


Meteor Test-Driven-Development Quickstart
===========================================

````sh
# install selenium-nightwatch
a$ cd helloworld
a$ mrt add jasmine-unit
a$ sudo mrt add selenium-nightwatch
a$ sudo packages/selenium-nightwatch/setup.sh
   2
a$ sudo mrt
b$ sudo ./run_nightwatch.js

# install velocity

a$ cd helloworld
a$ mrt add velocity-quick-start
a$ mrt

# install velocity html reporter, if you wish

a$ mrt add velocity-html-reporter

````
