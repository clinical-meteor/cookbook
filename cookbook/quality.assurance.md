##Quality Assurance Initiative

One of the major differentiators between Clinical Meteor apps and typical Meteor apps is that we use a variety of testing tools to implement a Quality Assurance initiative.  This initiative includes a Quality Improvement process for tracking feature requests and bug fixes, a Change Control process for evaluating pull-requests, and an application architecture that allows developers to implement [12 Factor Apps](http://12factor.net/) that pass the [Joel Test](http://www.joelonsoftware.com/articles/fog0000000043.html).  Between these systems and processes, business stakeholders and developers can be assured that the codebase is stable, there won't be regressions, and bugs can be tracked and removed from their applications.

##Continuous Deployment  
At the heart of the Quality Assurance initiative process is the Continuous Deployment process, which encompasses the Change Control process.  We have two tiers of testing...  a technical testing process called Verification testing, and a business testing process called Validation testing.  Both of these tests have to pass for an application to be deployed.

![ContinuousDeployment](https://raw.githubusercontent.com/clinical-meteor/cookbook/master/images/ContinuousDeployment.png)

For a more thorough look at Continuous Deployment, we recommend the excellent tutorial from Martin Bramwell:  
[Meteor Continuous Deployment](https://martinhbramwell.github.io/Meteor-CI-Tutorial/index.html)
