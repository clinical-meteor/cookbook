## Accounts



**Q:  services.facebook.picture doesn't return an image. How do I display a facebook image?**  

All you need is the facebook ID and a URL.  Try something like the following:  

````
Template.userCardTemplate.user_image = function () {
    try{
        if(Meteor.user().services.facebook){
            // this is the line of interest
            return "http://graph.facebook.com/" + Meteor.user().services.facebook.id + "/picture/?type=large";
        }else if(Meteor.user().profile){
            return $.trim(Meteor.user().profile.avatar);
        }else{
            return "/images/placeholder-240x240.gif";
        }
    }
    catch(err){
        console.log(err);
    }
};
````

**Q:  How do I get Facebook OAuth to work?  There's something wrong with the URLs.**  
Facebook is inconsistent.  Check the 'http://' at the beginning of your URLs.  The Site URL wants an 'http://', but the App Domains does not.  

````
Basic Info > App Domains:  might-river-5358.herokuapp.com  
Website with Facebook Login > Site URL:  http://might-river-5358.herokuapp.com  
````

**Q:  How do I customize the Accounts UI login page?**  
http://blog.benmcmahen.com/post/41741539120/building-a-customized-accounts-ui-for-meteor  


**Q:  Is there a way to get a login-page, and not have a drop-down menu?'**  
Check out this very clever package.  I haven't tried it, but it looks very promising.    
https://atmospherejs.com/useraccounts/core

Previously another project had a very big success
https://atmospherejs.com/joshowens/accounts-entry
...but it seems it is going to be abandoned (see [this post](https://github.com/Differential/accounts-entry/issues/326#issuecomment-65813192) by the original author)

**Q:  How do I define a transform function on the users collection?**  

Transform isn't official, and still has the underscore notation.  But Tom Coleman and folks recommend the following if you're willing to use unofficial functions...  
````js
Meteor.users._transform = X
````

**Q:  Authentication via Active Directory or LDAP protocol?**

See this thread:  
https://groups.google.com/forum/#!topic/meteor-talk/LCuA70wENRA
