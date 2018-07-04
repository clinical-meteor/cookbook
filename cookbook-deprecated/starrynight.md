
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


-----------------------------------------------
### [The StarryNight Utility](http://starrynight.meteor.com/)    

A project of this size eventually needs it's own tools and utilities.  Ours is called StarryNight, in keeping with the astronomy themes of Meteor and Nightwatch.  It's our general-purpose multi-tool where we put utilities for managing the package authoring workflow, refactoring code, installing dev environments, running validation/verification tests, security/performance auditing, and so forth.  Think of StarryNight as a framework utility that extends the core platform tools.

````sh
# install the utility
npm install starrynight -g

# run verification tests (similar to unit  or integration tests)
starrynight run-tests --type verification
starrynight run-tests --type package-verification

# run validation tests (similar to end-to-end or acceptance tests)
starrynight autoscan
starrynight run-tests --type validation

# or run a specific testing framework
starrynight scaffold --framework nightwatch
starrynight autoscan
starrynight run-framework nightwatch
````