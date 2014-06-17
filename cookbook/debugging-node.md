Debugging Node  
========================

[Node-Inspector](https://github.com/node-inspector/node-inspector)    
  
http://howtonode.org/debugging-with-node-inspector  
````
npm install -g node-inspector

export NODE_OPTIONS='--debug'
sudo mrt run
sudo node-inspector &

http://0.0.0.0:8080/debug?port=5858
````


**Q:  How do I debug node.js itself?**  
````
npm install -g node-inspector

export NODE_OPTIONS='--debug'
sudo mrt run
sudo node-inspector &

http://0.0.0.0:8080/debug?port=5858
````
