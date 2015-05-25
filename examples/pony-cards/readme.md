Pony Cards  
===========================================

Basic card game using ponies.

==========================================
#### Online Demo  

See an online demo at:  
http://pony-cards.meteor.com/


==========================================
#### Installation and Launch

````
$ git clone https://github.com/awatson1978/meteor-cookbook/
$ cd examples/pony-cards
$ meteor
````

==========================================
#### Build Recipe  

````
meteor create pony-cards
cd pony-cards

meteor add less
meteor add grigio:babel
meteor add starrynight:glass-ui
meteor add awatson1978:accounts-ponies

#raix:famono
#gadicohen:famous is a temporary hack
meteor add gadicohen:famous
meteor add gadicohen:famous-views


starrynight scaffold --framework nightwatch
starrynight scaffold --boilerplate project-homepage
rm -rf pony-cards.*

starrynight scaffold --boilerplate iron-router
starrynight scaffold --boilerplate mobile-app
starrynight scaffold --boilerplate client-server
starrynight scaffold --boilerplate active-record

starrynight refactor --from record --to user
starrynight refactor --from Record --to User

mkdir packages
cd packages
meteor create --package starrynight:dataset-pony-cards
meteor add starrynight:dataset-pony-cards
````




==========================================
#### Licensing

Meteor code is MIT; use as you will.  
The Pony images are probably proprietary in some way.  
