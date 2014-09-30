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


Meteor provides built in unit-testing through the  [undocumented](https://www.meteor.com/blog/2013/04/04/meteor-060-brand-new-distribution-system-app-packages-npm-integration) [tinytest packages](https://github.com/meteor/meteor/tree/devel/packages/tinytest), with some [helpers](https://github.com/meteor/meteor/tree/devel/packages/test-helpers). You can test your app that way too if you package it as a Meteor package, which amounts to adding a `package.js file`, adding a reference to ``tinytest``, and then runnning ``meteor test-packages`` from the command line.    

* [video tutorial on Eventedmind](https://www.eventedmind.com/tracks/feed-archive/meteor-testing-packages-with-tinytest)   
* [accompanying example](https://github.com/EventedMind/meteor-file)  
* [example of using the undocumented helpers for client testing](http://inconsistency.in/post/52547787175/flash-messages-package-and-testing-events-on-meteor).   
* [Tinytest integration with Travis CI](https://github.com/arunoda/travis-ci-meteor-packages)  

Alternatively, you can run the following commands:

````sh
meteor add tinytest
meteor test-packages
````

================================
#### Nightwatch  
A javascript wrapper for the Selenium automated browser testing server.  Supports Firefox, Chrome, PhantomJS browser automation (and more).  Integrates with Brows
[https://atmospherejs.com/package/munit](https://atmospherejs.com/package/munit)  


================================
#### Velocity
The newest full-featured reactive test runner.  

[Velocity Homepage](https://github.com/xolvio/velocity)
[Velocity Core Mailing List](https://groups.google.com/forum/#!forum/velocity-core)  
[Meteor Testing Manual](http://www.meteortesting.com/)  

================================
#### mUnit
Chai and Sinon hooks for TinyTest.
[https://atmospherejs.com/package/munit](https://atmospherejs.com/package/munit)  



================================
#### Older/Deprecated Projects (Probablly Want to Avoid)  

[RTD](http://rtd.xolv.io)  
[RTD Exampel Project](https://github.com/xolvio/meteor-rtd-example-project)  
[Unit Testing with Meteor](http://blog.xolv.io/2013/04/unit-testing-with-meteor.html)  
[Laika](http://arunoda.github.io/laika/)  
[Laika tutorial](http://mherman.org/blog/2014/01/29/meteor-dot-js-in-action-create-an-app-test-with-laika/)  
[Mocha-Web](https://atmosphere.meteor.com/package/mocha-web)   
[Meteor-Mocha-Web](https://github.com/mad-eye/meteor-mocha-web)  


------------------------------------------------------------------
#### Load Testing 

Using PhantomJS:  
https://gist.github.com/awatson1978/5139909  

Load Testing on AWS:  
https://groups.google.com/forum/?fromgroups=#!searchin/meteor-talk/load$20test/meteor-talk/BJXA1FRuTzU/M2e9pCH4es0J  
