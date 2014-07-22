Replica Set Configuration 
===============================

First, build yourself three servers.  This tutorial assumes you, using Ubuntu and whatever virtual machine technology you wish.  

# add the names of each server to the host file of each server
sudo nano /etc/hosts
  10.123.10.101 mongo-a
  10.123.10.102 mongo-b
  10.123.10.103 mongo-c

# install mongodb repository
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' | sudo tee /etc/apt/sources.list.d/mongodb.list
sudo apt-get update

# sudo yum install mongo-10gen mongo-10gen-server mongo-stable-server
sudo apt-get install mongodb-10gen

# edit mongodb startup script
sudo nano /etc/mongodb.conf
    dbpath=/data/db
    logpath=/data/logs/mongod.log
    logappend=true
    port=27017
    noauth=true
    replSet=meteor
    fork=true

sudo nano /etc/logrotate.d/mongod
  /data/logs/*.log {
    daily
    rotate 30
    compress
    dateext
    missingok
    notifempty
    sharedscripts
    copytruncate
    postrotate
        /bin/kill -SIGUSR1 `cat /var/lib/mongo/mongod.lock 2> /dev/null` 2> /dev/null || true
    endscript
  }


# make sure the mongo user and group have access to our custom directories
sudo chown -R mongodb:mongodb /data/logs
sudo chown -R mongodb:mongodb /data/warehouse

# make sure mongod service is started and running
sudo service mongodb start
#chkconfig --levels 235 mongod on

sudo reboot

# then go into the mongo shell and initiate the replica set
mongo
> rs.initiate()
> rs.add("mongo-a")
> rs.add("mongo-b")
> rs.add("mongo-c")
> rs.slaveOk()
