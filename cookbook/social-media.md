## Social Media



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
