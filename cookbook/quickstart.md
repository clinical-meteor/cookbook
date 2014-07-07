Meteor Quickstart Installation - OSX Mavericks
===========================================

This quickstart is written for Mac OSX, and is a bit more verbose than other installation instructions.  It should hopefully cover a few edge cases, such as setting your path, which can cause an installation to go awry.  

````sh
# install meteor
curl https://install.meteor.com | sh
 
# check it's installed correctly
meteor --version
 
# install node
# as of OSX Mavericks, we need the GUI installer (?!)
# when a good command line alternative is found, we'll post it
http://nodejs.org/download/
 
# install npm
sudo curl -0 -L https://npmjs.org/install.sh | sh

# check node is installed correctly
node -version
 
# check npm is installed correctly
npm -version
 
# find your npm path
which npm
 
# make sure npm is in your path
sudo nano ~/.profile
  export PATH=$PATH:/usr/local/bin
 
# install meteorite
npm install -g meteorite
 
# and if you have problems with permissions
sudo -H npm install -g meteorite
 
# check mrt is installed correctly
mrt --version
 
# find your mrt path
which mrt
locate mrt
 
# make sure meteorite is in your path
sudo nano ~/.profile
  export PATH=$PATH:/usr/local/share/npm/bin
 
# check mrt is installed correctly
mrt --version
````


Meteor Development Tools Quickstart - OSX Mavericks
===========================================

````
# install stand-alone mongo with the gui installer
http://www.mongodb.org/dr//fastdl.mongodb.org/osx/mongodb-osx-x86_64-2.6.3.tgz/download

# or install from command line
curl http://downloads.mongodb.org/osx/mongodb-osx-x86_64-2.6.3.tgz > mongodb-osx-x86_64-2.6.3.tgz
tar -zxvf mongodb-osx-x86_64-2.6.3.tgz
sudo mkdir -p /var/mongodb
cp -R -n mongodb-osx-x86_64-2.6.3/* /usr/local/mongodb

# make sure mongo is in your path
sudo nano ~/.profile
  export PATH=$PATH:/usr/local/bin

# create mongo database directory
mkdir /data/
mkdir /data/db
sudo chown -R username:admin /data

# run mongodb
mongodb

# install mongodb admin panel
http://blog.mongodb.org/post/28925264384/macosx-preferences-pane-for-mongodb

# check that you can launch stand alone mongo
terminal-a$ meteor create helloworld
terminal-a$ cd helloworld
terminal-a$ meteor

terminal-b$ mongo -p 3001

# install robomongo database admin tool and connect to port 3001
http://robomongo.org/

# check you can connect to your mongo instance
terminal-a$ meteor create helloworld
terminal-a$ cd helloworld
terminal-a$ meteor


# install node-inspector for server side debugging



````
