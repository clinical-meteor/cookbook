# Test Driven Development

For an introduction to different types of tests (unit, integration, functional, acceptance, regression, smoke tests), see these StackOverflow questions: 

[unit/integration/functional/acceptance](http://stackoverflow.com/questions/4904096/whats-the-difference-between-unit-functional-acceptance-and-integration-test)  
[integration/smoke/regression](http://stackoverflow.com/questions/520064/what-is-unit-test-integration-test-smoke-test-regression-test?lq=1)  

## Frameworks

So, the bad news is that the test driven development in Meteor is still somewhat in its infancy.  The good news is that it's starting to mature, with a number of different approaches being investigated.  So, maybe it's more of a toddler than an infant.   

Regardless, if you'd like a comprehensive rundown of the options, keep tabs on the following feature comparison table:  
http://safety-harness.meteor.com/features

#### [Tinytest](https://github.com/meteor/meteor/tree/devel/packages/tinytest)

Meteor's [undocumented](https://www.meteor.com/blog/2013/04/04/meteor-060-brand-new-distribution-system-app-packages-npm-integration) but built-in basic unit testing for writing packages, with some [helpers](https://github.com/meteor/meteor/tree/devel/packages/test-helpers). You can test your app that way too if you package it as a Meteor package, which amounts to adding a `package.js file`.  

* [video tutorial on Eventedmind](https://www.eventedmind.com/tracks/feed-archive/meteor-testing-packages-with-tinytest) and [accompanying example](https://github.com/EventedMind/meteor-file) + [example of using the undocumented helpers for client testing](http://inconsistency.in/post/52547787175/flash-messages-package-and-testing-events-on-meteor). 
* [Tinytest integration with Travis CI](https://github.com/arunoda/travis-ci-meteor-packages)

#### Mocha-Web

Basic unit test runner and HTML reporter, that can be installed as a package.  
[Atmosphere](https://atmosphere.meteor.com/package/mocha-web) / [GitHub](https://github.com/mad-eye/meteor-mocha-web)

#### [RTD](http://rtd.xolv.io) With Selenium, Mocha, Jasmine, and Istanbul
In-depth unit testing and acceptance testing; relies on a command line interface, and requires the app code to live in an `app` directory. [Inpsired by](http://blog.madeye.io/2013/02/testing-meteor-here-at-madeye-were-big.html?showComment=1364314050448#c7796997551340499047) Mocha-Web.  

* https://github.com/xolvio/meteor-rtd-example-project  
* http://blog.xolv.io/2013/04/unit-testing-with-meteor.html
* CoinsManager - [large-ish code base using RTD](https://github.com/CoinsManager/CoinsManager)

RTD [plans to integrate Laika](https://github.com/xolvio/rtd/issues/63).

#### [Laika](http://arunoda.github.io/laika/)
Integration testing using a command line interface, with a [somewhat convoluted API](https://github.com/arunoda/laika/issues/97).  Handy for engineering extensions to Meteor itself.  [Doesn't provide code coverage](https://github.com/xolvio/rtd/issues/22#issuecomment-20442959).

* Creating a Meteor app + [Laika tutorial](http://mherman.org/blog/2014/01/29/meteor-dot-js-in-action-create-an-app-test-with-laika/)

### Safety Harness
Acceptance testing framework with HTML reporter.  
http://safety-harness.meteor.com/

#### More

* "Testing" section on [Best learning resources for Meteor.js](http://yauh.de/articles/376/best-learning-resources-for-meteorjs)  
* [Meteor test-driven development](http://stackoverflow.com/questions/12987525/meteor-test-driven-development) on StackOverflow  

------------------------------------------------------------------
## Load Testing 

Using PhantomJS:  
https://gist.github.com/awatson1978/5139909  

Load Testing on AWS:  
https://groups.google.com/forum/?fromgroups=#!searchin/meteor-talk/load$20test/meteor-talk/BJXA1FRuTzU/M2e9pCH4es0J  
