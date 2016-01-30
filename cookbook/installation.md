 
## Installation & Uninstallation


**Q:  How do I determine what version of Meteor is installed?**  

Use the ``--version`` flag!  It's standard between Npm, Meteor, and Meteorite.
````sh
npm --version
meteor --version
mrt --version
````

**Q:  How do I run a specific version of Meteor?**  

Use the ``--release`` flag!  
````js
// for specifying meteor deployment target
meteor update --release 0.6.5

// for deployment
meteor bundle --release 0.6.5
````


**Q:  Should I install Npm with Node Version Manager?**  
Probably not.  One of the main features of Meteor is that it establishes a 'best practice' of which versions of libraries to use together, and does so by doing extensive unit tests and integration tests.  As part of that, it has opinions on which version of node you should be running, and will try to manage your version of node for you.  Running NVM breaks that process, and NVM winds up being more trouble than it's worth.  

````sh
# to check what version of NVM is installed
nvm ls
````

**Q:  How do I install and use a development branch of Meteor?**  
There are two ways, depending if you're using meteor, or meteorite.  If using meteor:

````
cd
mkdir meteor.branchname
cd meteor.branchname
git clone https://github.com/username/meteor.git
cd <path to meteor project>
~/meteor.branchname/meteor/meteor
```` 
 
And, if you're using mrt:
````
{
  "meteor": {
    "branch": "branchname",
    "git": "https://github.com/username/meteor.git"
  }
}
````
**Q:  How do I uninstall Meteor?**  
No need to run scripts.  Just delete directories like so:  
````js
// the older location, pre 0.6.0
sudo rm /usr/local/bin/meteor

// the newer location, post 0.6.0
sudo rm -rf ~/.meteor
````




