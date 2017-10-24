
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
