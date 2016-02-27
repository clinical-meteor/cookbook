##Quality Assurance Initiative

One of the major differentiators between Clinical Meteor apps and typical Meteor apps is that we use a variety of testing tools to implement a Quality Assurance initiative.  This initiative includes a Quality Improvement process for tracking feature requests and bug fixes, a Change Control process for evaluating pull-requests, and an application architecture that allows developers to implement [12 Factor Apps](http://12factor.net/) that pass the [Joel Test](http://www.joelonsoftware.com/articles/fog0000000043.html).  Between these systems and processes, business stakeholders and developers can be assured that the codebase is stable, there won't be regressions, and bugs can be tracked and removed from their applications.

##Application Continuous Deployment 
At the heart of the Quality Assurance initiative process is the idea that any app built with Clinical Meteor should have a Verification and Validation process which can be used for regulatory review by entities like the Food and Drug Administration.  In practice, this process is ideally implemented as a Continuous Deployment infrastructure.  It includes two tiers of testing...  a technical testing process called Verification testing, and a business testing process called Validation testing.  Both of these tests have to pass for an application to be deployed.

![ContinuousDeployment](https://raw.githubusercontent.com/clinical-meteor/cookbook/master/images/ContinuousDeployment.png)

For a more thorough look at Continuous Deployment, we recommend the excellent tutorial from Martin Bramwell, a former V&V consultant for NASA.
[Meteor Continuous Deployment](https://martinhbramwell.github.io/Meteor-CI-Tutorial/index.html)


##Version Control Branching Model




##Verification Validation Tests on Commits
We recommend that all applications built with Clinical Meteor use GitHub and Circle CI, so they can use the Status API and set up a Continuous Integration and Deployment process.  To configure Circle CI, simply add a .circle.yml file, and connect the webhooks in CircleCI and GitHub.

##Github Status API



##Release Track Change Control  
We implement a similar process for the packages within the Clinical Meteor Track itself, and use the Reference Apps as our baseline.

[Clinical Track Package QA](https://github.com/clinical-meteor/cookbook/tree/master/packages)

##Release Track Insights

We've set up a dashboard page for all of the packages in the Clinical Release track, where you can see the latest status of each package and reference app.
