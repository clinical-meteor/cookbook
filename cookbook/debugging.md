## Debugging  

[MeteorHacks - Debugging Meteor Packages and Apps](http://meteorhacks.com/debugging-meteor-packages-and-apps.html)  




#### Server Side Debugging  

[Oortcloud FAQ - How Do I Debug My Meteor App](https://github.com/oortcloud/unofficial-meteor-faq#how-do-i-debug-my-meteor-app)
]

[HowToNode - Debugging with Node Inspector](http://howtonode.org/debugging-with-node-inspector)  

[Strongloop - Debugging with Node Inspector](http://docs.strongloop.com/display/DOC/Debugging+with+Node+Inspector)  

[NodeKnockout - Debugging with Node Inspector](http://blog.nodeknockout.com/post/34843655876/debugging-with-node-inspector)


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


