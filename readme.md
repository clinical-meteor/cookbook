# Node on FHIR Cookbook

> Author's Note:  I'm attempting yet another reorg/rewrite of the Cookbook.  I'm mostly almost finished with the refactor from `meteor-on-fhir` to `node-on-fhir`, and finally have a reference target that I can document to.  And since the cookbook seemed to resonate with folks the most the first time around, I'm going back to its original moniker.  

Welcome to the Node on FHIR Cookbook.  This repository contains cookbook recipes for writing Node/Javascript software that's intended to be used in clinical, laboratory, and healthcare settings.  If you're using Node.js (and the Meteor build pipeline) and need to implement a HIPAA audit log, or do a schema migration on a document oriented database, or parse a pharmacogenomics pipeline... we probably have some recipes for helping that happen.  

Over the years, we've tried to extract some best practices from the problems we encounter again and again.  These best-practices have been codified in our companion software at [Node on FHIR](https://github.com/clinical-meteor/node-on-fhir)  

-----------------------------------------------
### [Getting Started](https://github.com/clinical-meteor/software-development-kit/blob/master/documentation/getting.started.md)  

The above walkthrough should get you started with a development environment, a scalable document-oriented database, compiling your first app, running QA scripts, and connecting to a healthcare server.  

-----------------------------------------------
### [Architecture Overview](https://github.com/clinical-meteor/software-development-kit/blob/master/cookbook/architecture-overview.md)  

Node on FHIR takes the assumption that it will be working with Fast Healthcare Interoperability Resources (FHIR) as the primary data standard throughout the entire software stack, from database to mobile application.  In implementing this vision, it uses a microservice architecture around an HTTP endpoint.  On the backend, it uses a document-oriented NoSQL JSON data storage for it's data warehouse, layers a FHIR server on top of that, and serves JSON formatted data to FHIR enabled mobile apps that are compiled from the same Javascript software that is running on the server.  Read the following for an overview of our full-stack javascript platform and the distributed data architecture.  

![Meteor Microservice Architecture](https://raw.githubusercontent.com/clinical-meteor/cookbook/master/images/MeteorMicroserviceArchitecture.png)  

-----------------------------------------------
### Design Principles

Our design principles for this software were initially inspired by the Meteor.js Principles, but with a focus on healthcare.  We eventually landed at the following design principles which we value in the development of this software stack:  

1.  One Language: Javascript
2.  Fast Healthcare Interoperability Resources
3.  Embrace the Ecosystem
4.  Web Standards
5.  Database Everywhere
6.  Continuous Integration
7.  HIPAA Security
8.  Day Made of Glass


-----------------------------------------------
### [Example Apps](https://github.com/clinical-meteor/cookbook/tree/master/examples-react)   
In developing this software, we built 100+ prototypes, forked a web application framework, and published a separate release track (Clinical Meteor) which acts as a baseline and standard by which to calibrate the rest of the quality-control and continuous-improvement processes that are necessary for regulatory review.  These prototypes and reference implementations use the packages from the `clinical` release track, and are baselined and referenced with various quality control measures.  i.e. We try to run the app through Touchstone or Crucible or Inferno test suites; make sure that the accounts package QA scripts are still passing; the package integration tests work, etc.  You may find the list of examples to be of general interest.

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
