## Debugging  



#### Server Side Debugging  

[Oortcloud FAQ - How Do I Debug My Meteor App](https://github.com/oortcloud/unofficial-meteor-faq#how-do-i-debug-my-meteor-app)
]


````sh
# install node-inspector
npm install -g node-inspector

#start meteor
NODE_OPTIONS='--debug-brk --debug' mrt run

# launch node-inspector
node-inspector

# go to the URL given by node-inspector
http://localhost:8080/debug?port=5858
````


