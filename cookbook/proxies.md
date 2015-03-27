Proxies
============================




#### Configuring Meteor To Work Around Pre-Existing Proxies  
This is a networking issue related to your operating system and local network topology, something that the Meteor Development Group doesn't really have any control over.  Some people have had success updating their bash environment variables, and running the installer with curl, like so:

````sh
// make sure your shell knows about your proxy
export http_proxy=http://your.proxy.server:port/

// install meteor manually
curl https://install.meteor.com | sh
````

================================
#### Setting up a Proxy Tier

There are two proxy technologies that most people in the Meteor community seem to be looking at.  Official support is expected for one (or more, via packages) of these.  

- [HAProxy](http://www.haproxy.org/)  
- [nginx](http://nginx.org/)  
 
- [Deploy Meteor App to Ubuntu with nginx Proxy](https://www.digitalocean.com/community/tutorials/how-to-deploy-a-meteor-js-application-on-ubuntu-14-04-with-nginx)

