Publishing A Release Track
=================================

... is actually pretty simple if you understand a) that the publish-release command requires a .json file as a parameter, and b) what that file looks like. That was definitely the biggest hurdle in getting started, because it's pretty much not documented anywhere.


=================================
####Release Manifest  
Here's an example of what it the release manifest should look like:

[clinical.meteor.rc9.json](https://github.com/clinical-meteor/framework-doc-generator/blob/develop/clinical.meteor.rc9.json)

Honestly, I'm a little surprised there's not a more active marketplace/trading of these manifest files. Maybe 2016 will be the year for that, and we'll get back to having curated distros for industry verticals.

Publication/Usage
But I digress. The idea is that we simply want to run something like the following command:

meteor publish-release clinical.meteor.rc6.json
Which will then allow us to run this:

meteor run --release clinical:METEOR@1.1.3-rc6
Identifying Packages to Include
To get things published isn't particularly difficult. Just requires a bit of busy work. In particular, keep in mind the following points:

Every package in the release has to be published and on Atmosphere.
The .meteor/versions file of an app is a particularly good place for finding all the necessary packages and versions that should go into the release.
After that, it's a matter of figuring out what you're willing to support, what you want to include, etc. Here is a partial Venn Diagram of what the Clinical Release is currently working on; and should give you a general idea of how we're going about the decision making process of what gets included.

[Clinical Meteor Release Track Venn Diagram]

Meteor Tool
If you need to extend the meteor tool or the command line, you'll need to create and publish your own meteor-tool package. Ronen's documentation is the best out there for this process:

http://practicalmeteor.com/using-meteor-publish-release-to-extend-the-meteor-command-line-tool/1

It's easy to get a meteor helloworld command working, but after that, I felt it was easier to just create a separate node app to test out commands. Which is how StarryNight came about. It's something of a staging ground and scratchpad for commands before trying to put them into a version of the meteor-tool.

StarryNight
Speaking of which, I created a small utility for creating the release manifest, which is available in StarryNight.

````bash
cd myapp
starrynight generate-release-json
````
