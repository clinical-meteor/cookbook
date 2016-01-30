clinical@Meteor Quickstart 
===========================================

````sh
# install node/npm
curl -0 -L https://npmjs.org/install.sh | sh

# install meteor
curl https://install.meteor.com | sh

# install the starrynight utility
npm install -g starrynight

# create a helloworld app
meteor create helloworld

# create a helloworld app (in development)
# starrynight generate helloworld

# add the framework components
meteor add clinical:framework

# add .meteor/nightwatch.json to our application
$ starrynight autoconfig

# run verification tests
$ starrynight run-tests --type verification
$ starrynight run-tests --type package-verification

# run validation tests
$ starrynight run-tests --type validation
#$ starrynight run-tests --type package-validation
````




