  


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


**Q:  Is there a way to get a login-page, and not have a drop-down menu?'**  
Check out this very clever package.  I haven't tried it, but it looks very promising.    
https://atmosphere.meteor.com/package/accounts-entry  

**Q:  How do I define a transform function on the users collection?**  

Transform isn't official, and still has the underscore notation.  But Tom Coleman and folks recommend the following if you're willing to use unofficial functions...  
````js
Meteor.users._transform = X
````

**Q:  I'm having problems managing Meteor.users in my social app.  Help?**  

The pattern for social apps involves two publications.  One for yourself, and one for other people.  You'll want something like the following:  

````js
// Publish a person's own user profile to themselves
Meteor.publish('userProfile', function (userId) {
  try{
    return Meteor.users.find({_id: this.userId}, {fields: {
      '_id': true,
      'username': true,
      'profile': true,
      'profile.name': true,
      'profile.avatar': true,
      'profile.username': true,

      'profile.favoriteColor': true,
      'profile.selectedTheme': true,

      'profile.address': true,
      'profile.city': true,
      'profile.state': true,
      'profile.zip': true,
      
      'emails': true,
      'emails[0].address': true,
      'emails.address': true
    }});

  }catch(error){
    console.log(error);
  }
});

// Publish the user directory which everbody can see
Meteor.publish("usersDirectory", function () {
  try{
    return Meteor.users.find({}, {fields: {
      '_id': true,
      'username': true,
      'profile': true,
      'profile.name': true,
      'profile.avatar': true,
      'profile.username': true,
      
      'emails': true,
      'emails[0].address': true,
      'emails.address': true
    }});
  }catch(error){
    console.log(error);
  }
});
````
Note that the profile details, such as address and theme preferences will only be visible to an individual user, and won't be visible to people browsing the user directory.  
