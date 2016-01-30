##Clinical Meteor Release Track

Welcome to the Meteor release track specializing in biomedical, healthcare, and clinical apps!  This was formerly the home of the Meteor Cookbook; and is now a full-blown Meteor release track and distro that aims to be FDA, HIPAA, and HL7 compliant.  We are currently working towards other regulatory credentialling, including DICOM, CLIA, CCHIT, EOE, and others.  

````
meteor run --release clinical:METEOR
````

========================================
###[Cookbook - Table of Contents](https://github.com/awatson1978/meteor-cookbook/blob/master/table-of-contents.md)   
The Clinical Meteor project started off as the Meteor Cookbook, a FAQ and tutorial curated from over 2 years of emails and discussions from the old [meteor] google group and the author's experiences rolling out packages and apps.  These documents were written for the intermediate user learning Meteor, who is accustomed to a) object-oriented frameworks and languages, such as Java and C#, and b) relational databases and data structures derived from SQL table schemas.  The focus was on helping the user grow accustomed to functional programming using document oriented databases.  Over the past years, much of the Cookbook has been migrated into the StarryNight utility, or moved into packages within the ``clinical:METEOR`` track.  The remaining material is being rewritten as a tutorial, guide, and white-paper documentation of the Clinical Track.

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
###[Example Apps](https://github.com/awatson1978/meteor-cookbook/tree/master/examples)  
We also provide a number of reference apps as part of the Clinical Meteor project, which act as a baseline and standard by which to calibrate the rest of the quality-control and continuous-improvement processes that are necessary for regulatory review.  These reference apps use the packages in the release track, are under quality control across multiple dimensions; and are suitable for benchmarking, baselining, and complex code refactorings.  




========================================
###[Clinical Meteor Track - Examples](https://github.com/awatson1978/meteor-cookbook/tree/master/examples-clinical)   

There are a number of example clinical apps as well.  Check these out if you're building in the biomedical or healthcare space.  


========================================
###Clinical Meteor Architecture  

This section is in the works, and will document the architecture behind creating HIPAA compliant apps with Meteor that can pass FDA/CCHIT review.  

![Meteor Architecture](https://raw.githubusercontent.com/awatson1978/meteor-cookbook/master/images/Meteor%20Architecture%20-%20Dev%20to%20Prod.jpg)  



========================================
###Development  

For those who want to clone or fork the repository and do local development, it's recommended to use the ``--recursive`` flag, which will recursively download the examples and packages.  

````bash
git clone --recursive http://github.com/awatson1978/meteor-cookbook MeteorCookbook
````


========================================
###Contributing  

Pull requests with typo corrections and copyediting are nearly always accepted.  

Most of the main development right now is in migrating cookbook recipes into components, packaging them up, and/or moving them into the StarryNight utility.  The cookbook is on its way to becoming the documentation for a Clinical Framework running on Meteor.  
