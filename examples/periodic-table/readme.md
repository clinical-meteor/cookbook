Periodic Table
===========================================

Famo.us caused quite a splash a few years ago with their Periodic Table demo.  The original demo is such an old version of Famo that it's difficult for people to even run, and none of the APIs are the same as what eventually got implemented.  So, this is an attempt to create a new version of the Periodic Table, which everybody loved, and to add to it the realtime database goodness that Meteor can provide.


==========================================
#### Online Demo  

See an online demo at:  
http://periodic-table.meteor.com/


==========================================
#### Installation and Launch

````
$ git clone https://github.com/awatson1978/meteor-cookbook/
$ cd examples/periodic-table
$ meteor
````

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


==========================================
#### Acknowledgements

Periodic table data is courtesy of Chris Andrejewski.  

https://www.npmjs.com/package/periodic-table
https://github.com/andrejewski/periodic-table  


Electron Shell Diagrams - mostly Creative Commons 2.
http://commons.wikimedia.org/wiki/Electron_shell
http://commons.wikimedia.org/wiki/Electron_shell#/media/File:Periodic_Table_of_Elements_showing_Electron_Shells_(2011_version).svg

==========================================
#### API Tutorials  


http://famous.org/learn/MixedMode/index.html
http://famous.org/docs


==========================================
#### Licensing

Meteor code is MIT; use as you will.  
