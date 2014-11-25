Test Driven Development
================================


At some point, as your app grows, you will reach a point where it's complexity exceeds your ability to remember and comprehend everything that's going on in it.  When that happens, you'll make a change in one part of the program which breaks a feature in another part.  When that happens, bugs start to get introduced.  The single best technique for managing increasing complexity, and keeping bugs out of your application, is the practice of *test driven development*.  If you're not doing TDD already, you should begin learning.  If you're already doing TDD, here are the tools you need to get started in Meteor.  

================================
#### Definitions 

For an introduction to different types of tests (unit, integration, functional, acceptance, regression, smoke tests), start with these StackOverflow articles, which do a fairly good job of covering terminology:   

[What is the Difference Between Unit, Integration, and Acceptance Testing?](http://stackoverflow.com/questions/4904096/whats-the-difference-between-unit-functional-acceptance-and-integration-test)  
[What are Unit, Integration, Regression, and Smoke Tests?](http://stackoverflow.com/questions/520064/what-is-unit-test-integration-test-smoke-test-regression-test?lq=1)  

================================
#### General Methodology - Red, Green, Refactor  

Test driven development is summarized by the phrase "Red, Green, Refactor".  Illustrated below.  
![Red, Green, Refactor](http://www.pathfindersolns.com/wp-content/uploads/2012/05/red-green-refactorFINAL2.png)  


================================
#### TinyTest  


Meteor provides built in unit-testing through the [tinytest packages](https://github.com/meteor/meteor/tree/devel/packages/tinytest).  As of Meteor 0.9.x, using Tinytest to add unit tests to your application begins with the following steps. 

````sh
cd myapp

# create your package of unit tests
mkdir packages
cd packages
meteor create --package quality-control
cd ..

# add tinytest to your app
meteor add tinytest

# run your tests
meteor test-packages

# add/edit your tests and repeat
nano packages/quality-control/quality-control-tests.js
````

There are some tutorials on how to use some older versions of Tinytest.  They should still mostly be up-to-date, as the Tinytest API hasn't changed drastically with the new package management system.  Let us know if you run into any discrepencies, and we'll update the Cookbook accordingly!  

* [video tutorial on Eventedmind](https://www.eventedmind.com/tracks/feed-archive/meteor-testing-packages-with-tinytest)   
* [accompanying example](https://github.com/EventedMind/meteor-file)  
* [example of using the undocumented helpers for client testing](http://inconsistency.in/post/52547787175/flash-messages-package-and-testing-events-on-meteor).   
* [Tinytest integration with Travis CI](https://github.com/arunoda/travis-ci-meteor-packages)  




================================
#### Nightwatch   
[Nightwatch](https://github.com/awatson1978/clinical-nightwatch) is the favorite testing framework of the Meteor Cookbook, as it's an *acceptance testing* framework.  Nightwatch itself is a javascript wrapper around the excellent [Selenium](http://www.seleniumhq.org/) automation testing server.  Selenium is an industry standard, and used by most all the major, major tech companies, such as Google and Facebook.  It supports Firefox, Chrome, PhantomJS, and many more browsers, and integrates with Seleneium Grid deployments, such as [BrowserStack](http://www.browserstack.com/) and [SauceLabs](https://saucelabs.com/).  

````sh
# Go to the root of your application
terminal-a$  cd myappdir
terminal-a$  meteor add clinical:nightwatch

# Go to the root of your application
terminal-a$ cd myappdir

# run the leaderboard application
terminal-a$ meteor

# In the same way that we run 'meteor mongo' in a separate terminal while our application is already running,
# we want to open up a new terminal, and run nightwatch
terminal-b$ ln -s .meteor/local/build/programs/server/assets/packages/clinical_nightwatch/launch_nightwatch_from_app_root.sh run_nightwatch.sh
terminal-b$ sudo ./run_nightwatch.sh

# you might want to do something clever like pass in arguments and run specific tests
terminal-b$ sudo ./run_nightwatch.sh -t tests/leaderboard.js
````


================================
#### Velocity
The newest full-featured reactive test runner.  

[Velocity Homepage](https://github.com/xolvio/velocity)
[Velocity Core Mailing List](https://groups.google.com/forum/#!forum/velocity-core)  
[Meteor Testing Manual](http://www.meteortesting.com/)  

================================
#### mUnit
[mUnit](https://atmospherejs.com/gfk/munit) is an independent testing framework, which took a very different approach to than Nightwatch and Velocity, and focused on providing Chai and Sinon hooks for TinyTest.  If you're looking for something lightweight that extends core Tinytest functionality, it's worth a look.  

````sh
meteor add gfk:munit
````

================================
#### Older/Deprecated Projects (Probablly Want to Avoid)  
The following tools are first-generation testing frameworks.  They represent a lot of experimentation, and you may find some useful utilities in them.  Most of them are deprecated or rolled into the Velocity project.  

[RTD](http://rtd.xolv.io)  
[RTD Exampel Project](https://github.com/xolvio/meteor-rtd-example-project)  
[Unit Testing with Meteor](http://blog.xolv.io/2013/04/unit-testing-with-meteor.html)  
[Laika](http://arunoda.github.io/laika/)  
[Laika tutorial](http://mherman.org/blog/2014/01/29/meteor-dot-js-in-action-create-an-app-test-with-laika/)  
[Mocha-Web](https://atmosphere.meteor.com/package/mocha-web)   
[Meteor-Mocha-Web](https://github.com/mad-eye/meteor-mocha-web)  
[Safety-Harness](https://github.com/awatson1978/safety-harness)  
[selenium-nightwatch](https://github.com/awatson1978/selenium-nightwatch-0.8.3)  

------------------------------------------------------------------
#### Load Testing 

Load testing is a cousin to unit-testing and acceptance testing, and involves driving large amounts of test traffic to a server, to see how an application performs under load.  This is a topic that's being actively researched and developed in the Meteor community, as many apps are going into production.  

Using PhantomJS  
https://gist.github.com/awatson1978/5139909  

Load Testing on AWS  
https://groups.google.com/forum/?fromgroups=#!searchin/meteor-talk/load$20test/meteor-talk/BJXA1FRuTzU/M2e9pCH4es0J  
