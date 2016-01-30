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


If you have any problems with EACCESS pr ENOENT errors, check the file permissions of your NPM directories.  
https://docs.npmjs.com/getting-started/fixing-npm-permissions


Test-Driven-Development Quickstart
===========================================
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
