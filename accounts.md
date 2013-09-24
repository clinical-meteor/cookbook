  


------------------------------------------------------------------
### Accounts

**Q: Is there any documentation on the User Profile?**  

The basic user profile looks like the following object:
````js
{
  username: 'jdoe',  
  emails: [{'address': 'somebody@somewhere.com', 'verified': true}],   
  profile: {
    'name': 'Jane Doe'
  }
}
````

The intention is that the first email address in the 'emails' list is the primary contact, where people want to be emailed, and the other addresses in the list are alternates that work for login but do not receive email.


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





**Q:  There are weird blue artifacts when using touch monitors.  How do I get rid of them?**  
The tap events don't handle :hover pseudoclasses very well.  Trying sprinkling your application with the following CSS class:

````
.unselectable{
  -moz-user-select: none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  user-select: none;
}
````






