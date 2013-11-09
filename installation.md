 
## Installation & Uninstallation

**Q:  Is there a Homebrew installer for Mac OSX?**  
Unofficially, yes.  It can be found here:  
https://gist.github.com/4317935

````
brew install https://gist.github.com/raw/4317935/05084353d3cd50acad7e88e01c3f6463b42c0ed3/meteor.rb
````

**Q:  Is there an MSI installer for Windows?**  
Unofficially, yes. The last released version is 0.6.4.1. It can be found here:  
http://win.meteor.com/

**Q:  When will Windows version become a first class citizen?**  
Not in the immediate future, as it's slated to be included after the 1.0 release.  In the meantime, it's recommended to use a virtual machine for development.  You can read the roadmap and relevant disscussions here:
https://trello.com/card/official-windows-support/508721606e02bb9d570016ae/11  
https://github.com/meteor/meteor/issues/867

**Q:  Can Meteor run on Rasberry Pi?**  
Daaah... maybe?  People seem to be working on it, but not much success yet.
http://www.badgersblog.co.uk/2012/12/nodejs-raspberry-pi-tutorial-1.html  
https://groups.google.com/forum/#!msg/meteor-talk/CcXzU14EHH8/3wvB-d1RfaAJ  


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
    "meteor.branch": "branchname",
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




