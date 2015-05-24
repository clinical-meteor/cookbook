Periodic Table
===========================================

Periodic Table using Meteor and Famo.us Mixed Mode.


==========================================
#### Installation



==========================================
#### Build Recipe  

````
meteor create periodic-table
cd periodic-table

meteor add less
meteor add grigio:babel

starrynight scaffold --framework nightwatch
starrynight scaffold --boilerplate project-homepage
rm -rf periodic-table.*

starrynight scaffold --boilerplate iron-router
starrynight scaffold --boilerplate mobile-app
starrynight scaffold --boilerplate client-server
starrynight scaffold --boilerplate active-record

starrynight refactor --from record --to elements
starrynight refactor --from Record --to Elements

mkdir packages
cd packages
meteor create --package starrynight:dataset-periodic-table
meteor add starrynight:dataset-periodic-table
````
