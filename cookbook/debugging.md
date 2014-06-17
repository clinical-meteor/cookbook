## Debugging  


#### Help!  My application has gotten slow and sluggish!  
The good folks over at Project Richochet have a great writeup on this...  
http://projectricochet.com/blog/meteor-js-performance#.Uov3V2Tk_fi  

Also, try the following things:  
- install the appcache package
- compress your images
- exclude the .meteor directory from your IDE
- use SSD drives to eliminate disk IO times to the cache
- host image assets on another server and hyperlink

#### Server Side Debugging  

[Oortcloud FAQ - How Do I Debug My Meteor App](https://github.com/oortcloud/unofficial-meteor-faq#how-do-i-debug-my-meteor-app)
]

````sh
# install node-inspector
npm install -g node-inspector

#start meteor
NODE_OPTIONS='--debug-brk' mrt run

# launch node-inspector
node-inspector

# go to the URL given by node-inspector
````
