 
## Scaling

**Q:  How do I specify an external database using MONGO_URL?**  

````sh
#make sure you're running the node v0.10.21 or later
sudo npm cache clean -f
sudo npm install -g n
sudo n 0.10.21

# bundle the app
cd utility-collection-explorer
sudo mrt bundle collectionExplorer.tar.gz

# move the bundle to where it's going to be deployed; then unzip
mv collectionExplorer.tar.gz ..
cd ..
mv collectionExplorer deployParentDirectory
cd deployParentDirectort
gunzip collectionExplorer.tar.gz
tar -xvf collectionExplorer.tar.gz

# make sure fibers is installed, as per the README
rm -r programs/server/node_modules/fibers/
npm install fibers@1.0.1
export MONGO_URL='mongodb://192.168.0.38:27017/webusers'
export PORT='3000'
export ROOT_URL='http://thinaire.net'

# run the site
node main.js
````



**Q:  How do I horizontally scale my application layer?**  
Okay, so you're starting to talk about separating your application layer from your database layer, and getting things ready for scale-out.  If you're looking for something quick and simple, try Modulus.io:  
http://blog.modulus.io/demeteorizer  
https://github.com/onmodulus/demeteorizer  

````
sudo npm install -g demeteorizer
sudo cd ~/path/myapp

sudo demeteorizer -n 0.8.11
sudo cd .demeteorized
sudo modulus login
sudo modulus deploy
````
