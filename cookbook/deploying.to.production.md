## PRODUCTION ENVIRONMENT

**Q:  Help!  Something broke in production!**  
Did you check it with ``--debug``?  There is a minification library that will parse your CSS and Javascript.  Check that it hasn't mangled your application by running your app with --debug.

**Q:  How do I deploy to Heroku?**  
Sadly, just don't.  Prior to 0.6.0, lots of people were using the Oortcloud Heroku Buildpack with much success.  As of 0.6.0, it seems to have broken, however.  And it's a moot point, because Heroku doesn't support Sticky Sessions, and won't scale up or support fail-over configurations.  Instead, use Meteor.com, CloudBees, or Modulus.io.  
https://github.com/oortcloud/heroku-buildpack-meteorite

**Q:  Are there any cloud hosting providers that provide unit testing?**  
CloudBees provides a Meteor clickstart, software-as-a-service, unit testing, and continuous integration.  It's a bit klunky, but if you're worried about continuous integration, it's the one to choose:  
https://github.com/CloudBees-community/meteor-clickstart  

**Q:  How do I monitor CPU utilization, memory utilization, etc?**  
See this discussion.  
https://groups.google.com/forum/#!topic/meteor-talk/91hcC87ch5k  




**Q:  What's the best practice for using content distribution networks (CDN)?**  
Currently, there's not anything specific, other than putting static content on your CDN, and creating links to it from your app.  You may want to run the meteor bundle command, and take a peek in the resulting tar.gz file.
````
meteor bundle
````

Also, follow the feature card on the Meteor roadmap:  
https://trello.com/card/speed-up-improve-app-loading/508721606e02bb9d570016ae/47


**Q: How do I run the node.js app that Meteor produces as a service?**  
http://kvz.io/blog/2009/12/15/run-nodejs-as-a-service-on-ubuntu-karmic/  

=============================================
#### Upstart Scripts  

[Upstart - Getting Started](http://upstart.ubuntu.com/getting-started.html)  
[Getting Started with Upstart Scripts on Ubuntu](http://buddylindsey.com/getting-started-with-and-understanding-upstart-scripts-on-ubuntu/)  
[UbuntuBootupHowTo](https://help.ubuntu.com/community/UbuntuBootupHowto)  
[Upstart Intro, Cookbook, and Best Practices](http://upstart.ubuntu.com/cookbook/)  


=============================================
#### Set Up Your Server

Set up your server and copy your files to the necessary directories.  

````sh
cd /var/www
sudo git clone http://github.com/myaccount/myapp.git
cd /var/www/myapp
````

=============================================
#### Set Up A Deployment Script

You'll want to create some type of file similar to the following in your application, that you can run from the command line, and which will bundle your app, and copy files to the necessary location.  Create a file ``deploy_on_production.sh`` in your application's root, and put the following commands in it.  

````sh
# /deploy_on_production.sh
BUNDLENAME=${PWD##*/}.$(date "+v%Y-%m-%d-%H-%M").tar.gz

echo "bundling meteor application: " $BUNDLENAME
sudo meteor bundle --debug $BUNDLENAME

echo 'copying bundle to parent directory'
mv $BUNDLENAME ..
cd ..

echo 'untarring bundle'
sudo tar -xzvf $BUNDLENAME

echo 'removing production backup'
sudo rm -rf production-backup

echo 'moving current production to backup'
sudo mv production production-backup

echo 'moving new version into proudction'
sudo mv bundle production

echo 'removing temp files...'
sudo rm $BUNDLENAME

echo 'that should be it. now try:'
echo 'sudo service myapp restart'
````

=============================================
#### Writing Your Upstart Script

Finally, create your upstart file in the ``/etc/init`` directory, and name it with your app's name, ending in ``.conf``.

````sh
# /etc/init/myapp.conf
description "myapp.mydomain.com"
author      "somebody@gmail.com"

# used to be: start on startup
# until we found some mounts weren't ready yet while booting:
start on started mountall
stop on shutdown

# Automatically Respawn:
respawn
respawn limit 99 5

script
    # upstart likes the $HOME variable to be specified
    export HOME="/root"
    
    # our example assumes you're using a replica set and/or oplog integreation
    export MONGO_URL='mongodb://mongo-a,mongo-b,mongo-c:27017/?replicaSet=meteor'
    
    # root_url and port are the other two important environment variables to set
    export ROOT_URL='http://myapp.mydomain.com'
    export PORT='80'

    exec /usr/local/bin/node /var/www/production/main.js >> /var/log/node.log 2>&1
end script

post-start script
   # Optionally put a script here that will notifiy you node has (re)started
   # /root/bin/hoptoad.sh "node.js has started!"
end script
````

