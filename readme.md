[![Stories in Ready](https://badge.waffle.io/clinical-meteor/software-development-kit.png?label=ready&title=Ready)](https://waffle.io/clinical-meteor/software-development-kit)
##Clinical Meteor Release Track

Welcome to the Meteor release track specializing in biomedical, healthcare, and clinical apps!  This was formerly the home of the Meteor Cookbook; and is now a full-blown [Meteor](https://github.com/meteor/meteor) release track and distro that aims to be FDA, HIPAA, and HL7 compliant.  We are currently working towards implementing other regulatory standards, including DICOM, CLIA, CCHIT, and EOE.  

If you'd like to use the latest packages that are under QA and audited to work together, be sure to specify the ``--release clinical:METEOR`` when you run meteor commands, like so:

````
meteor run --release clinical:METEOR
````


========================================
###[Getting Started Walkthrough](https://github.com/clinical-meteor/software-development-kit/blob/master/documentation/getting.started.md)  

The above walkthrough should get you started installing the SDK, setting up a development environment, a scalable database,  compiling your first app, and running QA scripts.  The following diagram attempts to give a basic subsystem diagram of the Meteor platform.

![Meteor Microservice Architecture](https://raw.githubusercontent.com/clinical-meteor/cookbook/master/images/MeteorMicroserviceArchitecture.png)  


========================================
###[Example Apps](https://github.com/awatson1978/meteor-cookbook/tree/master/examples)  
We also provide a number of reference apps as part of the Clinical Meteor project, which act as a baseline and standard by which to calibrate the rest of the quality-control and continuous-improvement processes that are necessary for regulatory review.  These reference apps use the packages in the release track, are under quality control across multiple dimensions; and are suitable for benchmarking, baselining, and complex code refactorings.  

========================================
###Local Development  

For those who want to clone or fork the project and do local development, it's recommended to use the ``--recursive`` flag, which will recursively download the examples and packages.  Be warned!  We're trying to keep things compressed and optimized, but the project still weighs in at over 330MB at this point!  When decompressed and project databases rehydrated, the project can swell to over a gigabyte in size.

````bash
git clone --recursive http://github.com/clinical-meteor/clinical-meteor ClinicalMeteor

# you can also update to the latest versions of the submodules 
git submodule update
````

========================================
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





========================================
###Contributing  

Pull requests with typo corrections and copyediting are nearly always accepted.  Feature requests for individual packages should be logged in their respective repositories.  Discussion regarding the larger overall project should be logged here.  Please see the [Governance](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/governance.md) documentation for more details on project governance.
