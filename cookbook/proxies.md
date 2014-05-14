Proxies
============================

**Q:  Help!  I'm behind a proxy!  How can I install/run Meteor behind a reverse proxy?**  
This is a networking issue related to your operating system and local network topology, something that the Meteor Development Group doesn't really have any control over.  Some people have had success updating their bash environment variables, and running the installer with curl, like so:
````sh
// make sure your shell knows about your proxy
export http_proxy=http://your.proxy.server:port/

// install meteor manually
curl https://install.meteor.com | sh
````
