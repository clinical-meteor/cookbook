# Node on FHIR Cookbook

Welcome to the Node on FHIR Cookbook.  This repository contains cookbook recipes for writing Node/Javascript software that's intended to be used in clinical, laboratory, and healthcare settings.  If you're using Node.js (and the Meteor build pipeline) and need to implement a HIPAA audit log, or do a schema migration on a document oriented database, or parse a pharmacogenomics pipeline... we probably have some recipes for helping that happen.  

Over the years, we've tried to extract some best practices from the problems we encounter again and again.  These best-practices have been codified in our companion software at [Node on FHIR](https://github.com/clinical-meteor/node-on-fhir)  

-----------------------------------------------
### [Getting Started Walkthrough](https://github.com/clinical-meteor/software-development-kit/blob/master/documentation/getting.started.md)  

The above walkthrough should get you started installing the SDK, setting up a development environment, a scalable database,  compiling your first app, and running QA scripts.  The following diagram attempts to give a basic subsystem diagram of the Meteor platform.

-----------------------------------------------
### [Architecture Overview](https://github.com/clinical-meteor/software-development-kit/blob/master/cookbook/architecture-overview.md)  

Clinical Meteor uses a NoSQL data pipeline architecture with isomorphic software.  Read the following for an overview of our full-stack javascript platform and the distributed data architecture.  

![Meteor Microservice Architecture](https://raw.githubusercontent.com/clinical-meteor/cookbook/master/images/MeteorMicroserviceArchitecture.png)  

-----------------------------------------------
### Design Principles

Yes, we're continuing the tradition of the Meteor Principles, but are focusing them on Healthcare apps!  These are the principles we believe in with regard to technology stack design (in no particular order).  

1.  One Language: Javascript
2.  Fast Healthcare Interoperability Resources
3.  Embrace the Ecosystem
4.  Web Standards
5.  Database Everywhere
6.  Continuous Integration
7.  HIPAA Security
8.  Day Made of Glass


-----------------------------------------------
### [Example Apps](https://github.com/awatson1978/meteor-cookbook/tree/master/examples)   
We also provide a number of reference apps as part of the Clinical Meteor project, which act as a baseline and standard by which to calibrate the rest of the quality-control and continuous-improvement processes that are necessary for regulatory review.  These reference apps use the packages in the release track, are under quality control across multiple dimensions; and are suitable for benchmarking, baselining, and complex code refactorings.  

-----------------------------------------------
### Local Development  
For those who want to clone or fork the project and do local development, it's recommended to use the ``--recursive`` flag, which will recursively download the examples and packages.  Be warned!  We're trying to keep things compressed and optimized, but the project still weighs in at over 330MB at this point!  When decompressed and project databases rehydrated, the project can swell to over a gigabyte in size.

````bash
git clone --recursive http://github.com/clinical-meteor/clinical-meteor 

# you can also update to the latest versions of the submodules 
cd clinical-meteor
git submodule update --recursive --remote --merge

# if you're submitting patchs and pull-requests 
git add . && git commit -m 'Update submodules to latest revisions message'
````

### History  

This repostiory was originally entitled the 'Meteor Cookbook', and was focused on recipes for making Meteor.js apps HIPAA compliant, FDA precertification ready, and interoperable via HL7 interfaces.  Add HL7 data schemas became a much larger project than anticipated, which lead to the creation of a fork/release track (clinical-meteor) and this project was renamed as a Software Development Kit.  We are finishing up a major refactor, which has renamed the base boilerplate form 'meteor-on-fhir' to 'node-on-fhir', and migrating to a more NPM centric package management system.  We're taking this moment to move back to the original naming convention of 'cookbook', with a focus on Node.js as the tech stack; and Meteor.js as our build pipeline.  

-----------------------------------------------
### Contributing   

Pull requests with typo corrections and copyediting are nearly always accepted.  Feature requests for individual packages should be logged in their respective repositories.  Discussion regarding the larger overall project should be logged here.  Please see the [Governance](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/governance.md) documentation for more details on project governance.
