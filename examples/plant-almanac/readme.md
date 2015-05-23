Plant Almanac
===========================================

The Old-Farmers' Almanac meets seed-packet inventory meets botanical latin learning app meets hydroponics utility meets garden planner.  


==========================================
#### Installation



==========================================
#### Build Recipe  

````
meteor create plant-almanac
cd plant-almanac

meteor add less
meteor add grigio:babel

starrynight scaffold --framework nightwatch
starrynight scaffold --boilerplate project-homepage
rm -rf plant-almanac.*

starrynight scaffold --boilerplate iron-router
starrynight scaffold --boilerplate mobile-app
starrynight scaffold --boilerplate client-server
starrynight scaffold --boilerplate active-record

starrynight refactor --from Plants --to Plants
starrynight refactor --from plant --to plants

mkdir packages
cd packages
meteor create --package clinical:dataset-plants
meteor add clinical:dataset-plants
````
