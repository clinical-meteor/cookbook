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

- [Deploy Meteor App to Ubuntu with nginx Proxy](https://www.digitalocean.com/community/tutorials/how-to-deploy-a-meteor-js-application-on-ubuntu-14-04-with-nginx)

- [How to Create an SSL Certificate on Nginx for Ubuntu 14](https://www.digitalocean.com/community/tutorials/how-to-create-an-ssl-certificate-on-nginx-for-ubuntu-14-04)

- [How to Deploy a Meteor JS App on Ubuntu with Nginx](https://www.digitalocean.com/community/tutorials/how-to-deploy-a-meteor-js-application-on-ubuntu-14-04-with-nginx)  

[How to Install an SSL Certificate from a Commercial Certificate Authority](https://www.digitalocean.com/community/tutorials/how-to-install-an-ssl-certificate-from-a-commercial-certificate-authority)  

[NameCheap SSL Certificates](https://www.namecheap.com/security/ssl-certificates/)  

