#Meteor Cookbook  

The Cookbook is growing!  And on it's way to becoming a framework/distro, specializing in biomedical, healthcare, and clinical apps!  We're contemplating renaming this repo as this project becomes more of a framework/distro, so stay tuned!  



========================================
###[Cookbook - Table of Contents](https://github.com/awatson1978/meteor-cookbook/blob/master/table-of-contents.md)   
The Meteor Cookbook started off as a FAQ and tutorial culled and curated from over 2 years of emails and discussions from the [meteor] google group and the author's experiences rolling out packages and apps.  These documents were written for the intermediate user learning Meteor, who is accustomed to a) object-oriented frameworks and languages, such as Java and C#, and b) relational databases and data structures derived from SQL table schemas.  The focus is on helping the user grow accustomed to functional programming using document oriented databases.  Going forward, these documents are being converted into scripts within the StarryNight utility, packages within the ``clinical:METEOR`` track, or whitepapers best-practices for the Clinical Track.

========================================
### [The StarryNight Utility](http://starrynight.meteor.com/)    

The Cookbook has gathered so many scripts that it's become clear that we need to just put them into a utility.  StarryNight has dozens of bells-and-whistles that aren't in the core platform... tools to help the package authoring workflow, refactoring code, installing a dev environment, testing your app, security/performance auditing, and so forth.  Think of StarryNight as a framework utility that extends the core platform tools.

````sh
# install the utility
npm install starrynight -g

# add the necessary test files
starrynight scaffold --framework nightwatch

# run tests as needed
starrynight run-framework nightwatch
````


========================================
###[Example Apps](https://github.com/awatson1978/meteor-cookbook/tree/master/examples)  
The recipes in the Cookbook are great, but often times it's just best to go look at actual applications to see how everything fits together.  Here you'll find nearly two dozen applets (and more in the works!) to help you get started building your own apps.  We're in the process of getting test/QA coverage for all these examples, and refactoring them to use a consistent component/microservice based architecture using the packages from the ``clinical:METEOR`` track.


========================================
### [Clinical Meteor Track](http://clinical.meteor.com/)    

The Cookbook is closely associated with the Clinical Meteor Track...  an effort to create a version of Meteor designed for biomedical, clinical, and healthcare applications that can be HIPAA compliant and pass FDA/CCHIT regulatory review.  Click the link above to see the project page and to learn more.  You can run your apps using the Clinical Meteor track by specifying a release.  There's not much difference between the Clinical Track and vanilla Meteor right now; but that will change over the next few months as we extract components from the examples and publish them.  

````
meteor run --release clinical:METEOR
````

========================================
###[Clinical Meteor Track - Examples](https://github.com/awatson1978/meteor-cookbook/tree/master/examples-clinical)   

There are a number of example clinical apps as well.  Check these out if you're building in the biomedical or healthcare space.  


========================================
###Clinical Meteor Architecture  

This section is in the works, and will document the architecture behind creating HIPAA compliant apps with Meteor that can pass FDA/CCHIT review.  

![Meteor Architecture](https://raw.githubusercontent.com/awatson1978/meteor-cookbook/master/images/Meteor%20Architecture%20-%20Dev%20to%20Prod.jpg)  



========================================
###Contributing  

Pull requests with typo corrections and copyediting are nearly always accepted.  

Most of the main development right now is in migrating cookbook recipes into components, packaging them up, and/or moving them into the StarryNight utility.  The cookbook is on it's way to becoming the documentation for a Clinical Framework running on Meteor.  





