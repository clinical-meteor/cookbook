## Deploying to Production  

There are two steps that need to be done to get a Meteor app into production.  Building your app, getting the application files to your server, and making sure the server automatically runs the built app.  You can do these three steps in a couple of different ways, but they all need to be done eventually.

=============================================
#### Upstart Service  

This deployment guide assumes you're using an Ubuntu server, and are either self-hosting or using an Infrastructure as a Service (IaaS) provider, such as Amazon Web Services or Rackspace.  Your Ubuntu server needs to be running a daemon for launching other apps, for which we recommend the Upstart service.  You can find more about Upstart with the following links:    

[Upstart - Getting Started](http://upstart.ubuntu.com/getting-started.html)  
[Getting Started with Upstart Scripts on Ubuntu](http://buddylindsey.com/getting-started-with-and-understanding-upstart-scripts-on-ubuntu/)  
[UbuntuBootupHowTo](https://help.ubuntu.com/community/UbuntuBootupHowto)  
[Upstart Intro, Cookbook, and Best Practices](http://upstart.ubuntu.com/cookbook/)  
[Run NodeJS As a Service on Ubuntu Karmic](http://kvz.io/blog/2009/12/15/run-nodejs-as-a-service-on-ubuntu-karmic/  )  

=============================================
#### Copying Files To Your Server Then Build

One favored approach to deploying to a server is to use Git or GitHub.  This basically involves logging into your server, moving to the directory you want to run your app from, then cloning your files directly from GitHub.  You then build your app on the server.  This approach ensures that platform specific files get built correctly, but requires that Meteor is installed on the server (500+ MB), and can result in slightly different builds wind up in production if your servers are slightly different.  

````sh
cd /var/www
sudo git clone http://github.com/myaccount/myapp.git
cd /var/www/myapp
meteor build --directory ../myapp-production
````

=============================================
#### Bundle Then Copy To Server

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

echo 'moving new version into production'
sudo mv bundle production

echo 'removing temp files...'
sudo rm $BUNDLENAME

echo 'that should be it. now try:'
echo 'sudo service myapp restart'
````


=============================================
#### Writing Your Upstart Script

If you've gotten to the point where you're running things in production, or want your application running continuously, you can set up your logs by running [Ubuntu's upstart command](http://upstart.ubuntu.com/) or [OSX System Starter](https://developer.apple.com/library/mac/documentation/Darwin/Reference/ManPages/man8/SystemStarter.8.html).  An Ubuntu upstart script which generates log files from a Meteor app in production looks like this:  

````sh
## /etc/init/helloworld.conf
description "hello world"
author      "awatson1978"

# Automatically Run on Startup
start on started mountall
stop on shutdown

# Automatically Respawn:
respawn
respawn limit 99 5

script
    export HOME="/root"
    export MONGO_URL='mongodb://helloworld.mongohq.com:27017/meteor'
    export ROOT_URL='http://helloworld.meteor.com'
    export PORT='80'

    exec /usr/local/bin/node /var/www/helloworld/main.js >> /var/log/helloworld.log 2>&1
end script
````


=============================================
#### Upstart Script For Replica Sets  

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

