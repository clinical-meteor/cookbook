# Node on FHIR Cookbook

Welcome to the Meteor release track specializing in biomedical, healthcare, and clinical apps!  This was formerly the home of the Meteor Cookbook; and is now a full-blown [Meteor](https://github.com/meteor/meteor) release track and distro that aims to be FDA, HIPAA, and HL7 compliant.  We are currently working towards implementing other regulatory standards, including DICOM, CLIA, CCHIT, and EOE.  

If you'd like to use the latest packages that are under QA and audited to work together, be sure to specify the ``--release clinical:METEOR`` when you run meteor commands, like so:

````
meteor run --release clinical:METEOR
````


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


-----------------------------------------------
### Contributing   

Pull requests with typo corrections and copyediting are nearly always accepted.  Feature requests for individual packages should be logged in their respective repositories.  Discussion regarding the larger overall project should be logged here.  Please see the [Governance](https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/governance.md) documentation for more details on project governance.

