##Project Governance

Please see http://oss-watch.ac.uk/resources/governancemodels

=========================
####Overview

In the beginning of 2016, the Clinical Meteor project has accumulated over 1600 stars, 200 forks, and a dozen companies expressing interest in venture capital investments.  In the past month, I've seen interns get assigned to the project, a small freelancing community spring up around the project, inquiries from investors regarding assigning hundred person teams to use the project, and multiple inquiries about my interest and availability in taking on a more architectural role.  These developments are all possible because as of Dec 2015, we now have a publicly-reviewable quality assurance process in place.  

Since all quality assurance processes also double as change control processes, we now have an induced capacity to accept contributions from a wider community.  And that means we need a governance structure to determine which pull requests make it into the project.  It starts with "don't break the build", which translates into "no pull requests will get accepted that don't pass green on the CircleCI tests".  After that, it gets a bit more complicated, and we need a governance structure and a document explaining the structure.

As such, this is still a document in progress.  We are trying to remain an Ubuntu model; but due to healthcare being a regulated industry, are leaning heavily towards the Apache OODT meritocracy model.



=========================
####Roles and Responsibilities

We are adopting the default GitHub roles and responsibilities.

- Organization Owner
- Organization Member
- Team Maintainer
- Team Member
- Collaborator 

Please familiarize yourself with the following two security documents, which detail the authority and access granted to these roles.

[Permission levels for an organization](https://help.github.com/enterprise/2.4/user/articles/permission-levels-for-an-organization/)
[repository-permission-levels-for-an-organization](http://help.github.com/enterprise/2.4/user/articles/repository-permission-levels-for-an-organization/)



=========================
####Support

Establishing additional channels of communication is a high priority goal for 2016, so we will also be dogfooding our own forum using Clinical Meteor, setting up a RocketChat channel, and establishing a space for architectural discussions.

Technical support for Meteor related questions can be directed towards http://forums.meteor.com.  Please use the [Clinical] tag in your subject header.

Healthcare design discussion can be directed towards http://invent.healthcare/



=========================
####Decision Making Process 

The decision making process generally starts with logging an issue, and involves writing QA test at some point.  Please note the following specifics:  

**Code Contribution - Bug Fixes**. 

- Don't break the build. Move deliberately and don't break things.
- No pull requests will get accepted that don't pass green on the CircleCI tests

**Code Contribution - New Features**. 

- Log an issue first.
- Get at least one other person commenting on the issue.
- New features are more likely to be accepted if they have QA tests.

**New Packages and Repositories**. 

- Definately log an issue first.
- In the issue, list:
    - library dependencies
    - use cases
    - relevant standards committees
    - test scenarios
- If the package contains code and increases regulatory burden, drafting an initial test script will fast-track the decision making process.

**New Subprojects**. 
- New subprojects generally start with the need to conform to an external standards reference...  HL7, DICOM, CLIA, etc.


=========================
####Contribution Process

We have put a lot of work in setting up a publicly accessible quality-control process, and are looking forward to contributions from the broader healthcare community.  We recommend the following steps to get started contributing:  


- Pull Requests will be generally accepted as long as the QA tests pass on [Circle CI](https://circleci.com/gh/clinical-meteor/clinical-active-entry).
- Begin a Pull Request by logging an Issue for discussion.
- Next, clone the package into a project for local development.
- Use ``git checkout -b newfeature`` to create a new branch.  
- Run the package verification tests to ensure that the test runner works.   
- Add an it() clause at the bottom of the [activeEntryTests.js](https://github.com/clinical-meteor/clinical-active-entry/blob/master/tests/gagarin/activeEntryTests.js) file for each new feature you wish to implement.  
- Sketch out a test script for a feature.
- Run the verification tests, and confirm that the new test fails.  
- Update the package with the new feature until the new test passes.
- Push the package to the repo on GitHub.
- Submit a pull-request to the develop branch
- If the PR passes tests on Circle CI, we'll merge it in!  
